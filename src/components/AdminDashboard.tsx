import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAdminProjects, createProject, updateProject, deleteProject, updateProjectStatus, type AdminProject } from "@/services/projectsService";
import { adminApi, uploadApi, contactApi, healthApi, type ContactMessage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const { toast } = useToast();
  type StatutBackend = 'EN_COURS' | 'TERMINE' | 'EN_ATTENTE';
  type StatutFrontend = 'En cours' | 'Terminé' | 'En attente'

    // Fonctions de conversion
  const formaterStatut = (statut: StatutBackend | StatutFrontend): StatutFrontend => {
    switch (statut) {
      case 'TERMINE': return 'Terminé';
      case 'EN_COURS': return 'En cours';
      case 'EN_ATTENTE': return 'En attente';
      case 'Terminé': return 'Terminé';
      case 'En cours': return 'En cours';
      case 'En attente': return 'En attente';
      default: return 'En attente';
    }
  };

  const versStatutBackend = (statut: StatutFrontend): StatutBackend => {
    switch (statut) {
      case 'Terminé': return 'TERMINE';
      case 'En cours': return 'EN_COURS';
      case 'En attente': return 'EN_ATTENTE';
    }
  };

  // Charger les projets et vérifier la connexion à la base de données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Vérifier la connexion à la base de données
      await checkDatabaseConnection();
      
      // Charger les projets depuis l'API
      await loadProjects();

      // Charger les messages de contact
      await loadMessages();
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données. Utilisation des données locales.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkDatabaseConnection = async () => {
    try {
      const response = await healthApi.checkHealth();
      if (response.success) {
        setDbStatus('connected');
        toast({
          title: "Base de données",
          description: "✅ Connexion à la base de données réussie",
          variant: "default",
        });
      }
    } catch (error) {
      setDbStatus('disconnected');
      console.error('Erreur de connexion à la base de données:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const adminProjects = await getAllAdminProjects();
      setProjects(adminProjects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets depuis l'API",
        variant: "destructive",
      });
    }
  };

  const loadMessages = async () => {
    try {
      const response = await contactApi.getAllMessages();
      if (response.success && response.data) {
        setMessages(response.data.messages);
        console.log('📧 Messages de contact chargés:', response.data.messages.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        title: "Messages",
        description: "Impossible de charger les messages de contact",
        variant: "destructive",
      });
    }
  };

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: [] as string[],
    client: "",
    duration: "",
    status: "En attente" as StatutFrontend,
    image: null as File | null,
    imagePreview: null as string | null,
    url: "",
  });

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [currentTechnology, setCurrentTechnology] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messageReply, setMessageReply] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    adminApi.logout();
    navigate("/admin");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject({
          ...newProject,
          image: file,
          imagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addTechnology = () => {
    if (currentTechnology.trim() && !newProject.technologies.includes(currentTechnology.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, currentTechnology.trim()]
      });
      setCurrentTechnology("");
    }
  };

  const removeTechnology = (tech: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter(t => t !== tech)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let imageUrl = newProject.imagePreview;
      
      // Upload de l'image si nécessaire
      if (newProject.image) {
        setIsUploadingImage(true);
        try {
          const uploadResponse = await uploadApi.uploadImage(newProject.image);
          if (uploadResponse.success && uploadResponse.data) {
            imageUrl = uploadResponse.data.imageUrl;
          }
        } catch (uploadError) {
          // console.error('Erreur lors de l\'upload:', uploadError);
          // toast({
          //   title: "Erreur",
          //   description: "Erreur lors de l'upload de l'image. Le projet sera créé sans image.",
          //   variant: "destructive",
          // });
        } finally {
          setIsUploadingImage(false);
        }
      }

      const projectData = {
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies,
        client: newProject.client,
        duration: newProject.duration,
        status: versStatutBackend(newProject.status),
        imageUrl: imageUrl,
        url: newProject.url,
        date: new Date().toISOString().slice(0, 10)
      };

      console.log('📝 Données projet à créer:', projectData);

      if (editingProjectId !== null) {
        // Mise à jour
        const updatedProject = await updateProject(editingProjectId, projectData);
        if (updatedProject) {
          setProjects(projects.map(p => p.id === editingProjectId ? updatedProject : p));
          toast({
            title: "Succès",
            description: "Projet mis à jour avec succès",
          });
        }
        setEditingProjectId(null);
      } else {
        // Création
        const newCreatedProject = await createProject(projectData);
        if (newCreatedProject) {
          setProjects([newCreatedProject, ...projects]);
          toast({
            title: "Succès",
            description: "Projet créé avec succès",
          });
        }
      }

      // Reset du formulaire
      setNewProject({
        title: "",
        description: "",
        technologies: [],
        client: "",
        duration: "",
        status: "En attente",
        image: null,
        imagePreview: null,
        url: "",
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la soumission",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: AdminProject) => {
    setNewProject({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      client: project.client,
      duration: project.duration,
      status: formatStatus(project.status) as 'En cours' | 'Terminé' | 'En attente',
      image: null,
      imagePreview: project.imagePreview || project.imageUrl,
      url: project.url || "",
    });
    setEditingProjectId(project.id);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      const success = await deleteProject(projectId);
      if (success) {
        setProjects(projects.filter((project) => project.id !== projectId));
        toast({
          title: "Succès",
          description: "Projet supprimé avec succès",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du projet",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: AdminProject['status']) => {
    try {
      const updatedProject = await updateProjectStatus(projectId, newStatus);
      if (updatedProject) {
        setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
        toast({
          title: "Succès",
          description: `Statut changé vers "${formaterStatut(newStatus)}"`,
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du changement de statut",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      const response = await contactApi.deleteMessage(messageId);
      if (response.success) {
        setMessages(messages.filter((message) => message.id !== messageId));
        toast({
          title: "Succès",
          description: "Message supprimé avec succès",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du message",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await contactApi.updateMessageStatus(messageId, 'LU');
      if (response.success && response.data) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? response.data.message : msg
        ));
        toast({
          title: "Succès",
          description: "Message marqué comme lu",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  const handleChangeMessageStatus = async (messageId: string, newStatus: ContactMessage['status']) => {
    if (!newStatus) return;

    try {
      const response = await contactApi.updateMessageStatus(messageId, newStatus);
      if (response.success && response.data) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? response.data.message : msg
        ));
        toast({
          title: "Succès",
          description: `Statut changé vers "${newStatus}"`,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TERMINE': 
      case 'Terminé': return 'text-green-400 bg-green-900/20 border-green-500';
      case 'EN_COURS':
      case 'En cours': return 'text-blue-400 bg-blue-900/20 border-blue-500';
      case 'EN_ATTENTE':
      case 'En attente': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'TERMINE': return 'Terminé';
      case 'EN_COURS': return 'En cours';
      case 'EN_ATTENTE': return 'En attente';
      default: return status;
    }
  };

  const handleEmail = (message: ContactMessage) => {
    return () => {
      const email = message.email;
      const name = message.name;
      const subject = encodeURIComponent('Réponse à votre message');
      const body = encodeURIComponent(
        `Bonjour ${name},\n\n` +
      `Nous avons bien reçu votre demande concernant :\n"${message.subject || ''}"\n\n` +
      `Notre équipe vous contactera rapidement.\n\n` +
      `Cordialement,\nL'équipe de l'Aria Creative\n\n`
      );

      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

      try {
        if (navigator.onLine) {
          console.log('Ouverture de Gmail…');
          window.open(gmailURL, '_blank');
        } else {
          alert("Veuillez vérifier votre connexion Internet avant d'envoyer un message.");
        }
      } catch (error) {
        console.error("Erreur lors de l'ouverture de Gmail :", error);
        alert("Impossible d'ouvrir Gmail. Veuillez nous contacter manuellement à : " + email);
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeInDown">
          <div>
            <h1 className="text-4xl font-bold text-white transform transition duration-500 hover:scale-105">
              <span className="text-orange-400">Dashboard</span> <span className="text-white">Admin</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : dbStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`}></div>
              <span className="text-sm text-gray-400">
                Base de données: {
                  dbStatus === 'connected' ? 'Connectée' :
                  dbStatus === 'disconnected' ? 'Déconnectée' : 'Vérification...'
                }
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-black font-semibold py-3 px-6 rounded-lg hover:from-orange-400 hover:to-orange-300 transition duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-orange-500/50 border border-orange-400"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            {/* New Post Form */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-orange-500/20 animate-fadeInLeft border border-gray-800">
              <h2 className="text-2xl font-semibold mb-6 text-orange-400 transform transition duration-500 hover:translate-x-2">
                {editingProjectId !== null ? "Modifier le projet" : "Nouveau projet"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-orange-300 mb-2 font-medium" htmlFor="title">
                    Titre du projet
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 focus:border-orange-500 hover:border-gray-600"
                    required
                    placeholder="Nom du projet..."
                  />
                </div>
                <div>
                  <label className="block text-orange-300 mb-2 font-medium" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 focus:border-orange-500 hover:border-gray-600 resize-none"
                    required
                    placeholder="Description du projet..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-orange-300 mb-2 font-medium" htmlFor="client">
                      Client
                    </label>
                    <input
                      type="text"
                      id="client"
                      name="client"
                      value={newProject.client}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 focus:border-orange-500 hover:border-gray-600"
                      required
                      placeholder="Nom du client..."
                    />
                  </div>
                  <div>
                    <label className="block text-orange-300 mb-2 font-medium" htmlFor="duration">
                      Durée
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={newProject.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 focus:border-orange-500 hover:border-gray-600"
                      required
                      placeholder="ex: 3 mois"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-orange-300 mb-2 font-medium" htmlFor="status">
                      Statut
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newProject.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 focus:border-orange-500 hover:border-gray-600"
                      required
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-orange-300 mb-2 font-medium" htmlFor="url">
                      URL (optionnel)
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={newProject.url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 focus:border-orange-500 hover:border-gray-600"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-orange-300 mb-2 font-medium">
                    Technologies utilisées
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentTechnology}
                      onChange={(e) => setCurrentTechnology(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      className="flex-1 px-4 py-2 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 focus:border-orange-500 hover:border-gray-600"
                      placeholder="Ajouter une technologie..."
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition duration-300 font-medium"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/50 text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 text-orange-400 hover:text-orange-300 transition duration-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-orange-300 mb-2 font-medium" htmlFor="image">
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="block w-full px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition duration-300 transform hover:scale-[1.01] shadow-sm text-orange-300 text-center font-medium hover:border-orange-500"
                  >
                     Choisir une image du projet
                  </label>
                  {newProject.imagePreview && (
                    <div className="mt-4 animate-fadeIn">
                      <img
                        src={newProject.imagePreview}
                        alt="Preview"
                        className="h-40 w-full object-cover rounded-lg border-2 border-orange-500 transition duration-300 hover:scale-[1.02] shadow-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  {editingProjectId !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewProject({
                          title: "",
                          description: "",
                          technologies: [],
                          client: "",
                          duration: "",
                          status: "En attente",
                          image: null,
                          imagePreview: null,
                          url: "",
                        });
                        setEditingProjectId(null);
                      }}
                      className="bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 transform hover:-translate-y-1 font-medium"
                    >
                      Annuler
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading || isUploadingImage}
                    className="bg-gradient-to-r from-orange-500 to-orange-400 text-black font-semibold py-3 px-6 rounded-lg hover:from-orange-400 hover:to-orange-300 transition duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (isUploadingImage ? "Upload en cours..." : "Traitement...") : 
                     editingProjectId !== null ? "Modifier" : "Créer le projet"}
                  </button>
                </div>
              </form>
            </div>

            {/* Statistics */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl mt-8 transition-all duration-500 hover:shadow-orange-500/20 animate-fadeInUp border border-gray-800">
              <h2 className="text-2xl font-semibold mb-6 text-orange-400">
                 Statistiques
              </h2>
              <div className="space-y-4">
                <div className="bg-black p-4 rounded-lg border border-gray-800 transition duration-300 hover:border-orange-500">
                  <p className="text-orange-300 font-medium">Projets totaux</p>
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                </div>
                <div className="bg-black p-4 rounded-lg border border-gray-800 transition duration-300 hover:border-orange-500">
                  <p className="text-orange-300 font-medium">Projets terminés</p>
                  <p className="text-2xl font-bold text-white">{projects.filter(p => formaterStatut(p.status) === 'Terminé').length}</p>
                </div>
                <div className="bg-black p-4 rounded-lg border border-gray-800 transition duration-300 hover:border-orange-500">
                  <p className="text-orange-300 font-medium">Projets en cours</p>
                  <p className="text-2xl font-bold text-white">{projects.filter(p => formaterStatut(p.status) === 'En cours').length}</p>
                </div>
                {/* <div className="bg-black p-4 rounded-lg border border-gray-800 transition duration-300 hover:border-orange-500">
                  <p className="text-orange-300 font-medium">Visiteurs aujourd'hui</p>
                  <p className="text-2xl font-bold text-white">42</p>
                </div> */}
                <div className="bg-black p-4 rounded-lg border border-gray-800 transition duration-300 hover:border-orange-500">
                  <p className="text-orange-300 font-medium">Messages clients</p>
                  <p className="text-2xl font-bold text-white">{messages.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {/* Customer Messages */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl mb-8 animate-fadeInRight border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-orange-400 transform transition duration-500 hover:translate-x-1">
                   Messages des clients
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-400">
                    {messages.filter(m => m.status === 'NOUVEAU').length} nouveaux
                  </div>
                  <button
                    onClick={loadData}
                    disabled={isLoading}
                    className="bg-orange-500 hover:bg-orange-400 text-black px-3 py-1 rounded-lg text-sm font-medium transition duration-300 flex items-center gap-1 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Chargement...
                      </>
                    ) : (
                      '🔄 Actualiser'
                    )}
                  </button>
                </div>
              </div>
              {messages.length === 0 ? (
                <p className="text-gray-400 animate-pulse text-center py-8">Aucun message pour le moment</p>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`bg-black border rounded-lg p-6 transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 animate-fadeIn ${
                        message.status === 'NOUVEAU' ? 'border-orange-500/50 bg-orange-500/5' : 'border-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-bold text-orange-400">
                            {message.subject}
                          </h3>
                          <select
                            value={message.status}
                            onChange={(e) => handleChangeMessageStatus(message.id!, e.target.value as ContactMessage['status'])}
                            className={`text-xs px-2 py-1 rounded-full border ${
                              message.status === 'NOUVEAU' ? 'bg-orange-500/20 text-orange-400 border-orange-500' :
                              message.status === 'LU' ? 'bg-blue-500/20 text-blue-400 border-blue-500' :
                              message.status === 'TRAITE' ? 'bg-green-500/20 text-green-400 border-green-500' :
                              'bg-gray-500/20 text-gray-400 border-gray-500'
                            } bg-transparent cursor-pointer`}
                          >
                            <option value="NOUVEAU" className="bg-gray-900">🆕 Nouveau</option>
                            <option value="LU" className="bg-gray-900">👁 Lu</option>
                            <option value="TRAITE" className="bg-gray-900">✅ Traité</option>
                            {/* <option value="ARCHIVE" className="bg-gray-900">📁 Archivé</option> */}
                          </select>
                        </div>
                        <span className="text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full">
                          {message.createdAt ? new Date(message.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date inconnue'}
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-gray-300">
                          <span className="text-orange-300 font-medium">De:</span> {message.name}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-orange-300 font-medium">Entreprise:</span> {message.company || 'Non spécifiée'}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-orange-300 font-medium">Email:</span> {message.email}
                        </p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-orange-500">
                        <p className="text-white leading-relaxed">
                          {message.message}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                          {message.status === 'NOUVEAU' && (
                            <button
                              onClick={() => handleMarkAsRead(message.id!)}
                              className="text-blue-400 hover:text-blue-300 transition duration-300 font-medium px-3 py-1 rounded border border-blue-500 hover:bg-blue-500 hover:text-black"
                            >
                              ✓ Marquer lu
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(message.id!)}
                            className="text-red-400 hover:text-red-300 transition duration-300 font-medium px-3 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-black"
                          >
                            🗑 Supprimer
                          </button>
                        </div>
                          <button 
                            onClick={() => handleEmail(message)}
                            className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                              message.status === 'LU' || message.status === 'TRAITE'
                                ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            disabled={message.status === 'LU'}
                          >
                            ✉ Répondre au client
                          </button>
                        {/* <a
                          href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                          className="text-orange-400 hover:text-orange-300 transition duration-300 font-medium px-3 py-1 rounded border border-orange-500 hover:bg-orange-500 hover:text-black"
                        >
                          📧 Email direct
                        </a> */}
                      </div>
                      {selectedMessageId === message.id && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 animate-fadeIn">
                          <h4 className="text-orange-400 font-medium mb-3">Répondre à {message.name}</h4>
                          <textarea
                            value={messageReply}
                            onChange={(e) => setMessageReply(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 focus:border-orange-500 hover:border-gray-600 resize-none"
                            placeholder="Tapez votre réponse..."
                          />
                          <div className="flex justify-end space-x-2 mt-3">
                            <button
                              onClick={() => {
                                setSelectedMessageId(null);
                                setMessageReply("");
                              }}
                              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 font-medium"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => {
                                // Ici vous pourriez ajouter la logique d'envoi d'email
                                alert(`Réponse envoyée à ${message.email}`);
                                setSelectedMessageId(null);
                                setMessageReply("");
                              }}
                              className="bg-gradient-to-r from-orange-500 to-orange-400 text-black font-semibold py-2 px-4 rounded-lg hover:from-orange-400 hover:to-orange-300 transition duration-300"
                            >
                              Envoyer réponse
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl animate-fadeInRight border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-orange-400 transform transition duration-500 hover:translate-x-1">
                   Projets (Nos réalisations)
                </h2>
                <div className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  {projects.filter(p => formaterStatut(p.status) === 'Terminé').length} publiés sur le site
                </div>
                                  <button
                    onClick={loadData}
                    disabled={isLoading}
                    className="bg-orange-500 hover:bg-orange-400 text-black px-3 py-1 rounded-lg text-sm font-medium transition duration-300 flex items-center gap-1 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Chargement...
                      </>
                    ) : (
                      '🔄 Actualiser'
                    )}
                  </button>
              </div>
              {projects.length === 0 ? (
                <p className="text-gray-400 animate-pulse text-center py-8">
                  {isLoading ? "Chargement des projets..." : "Aucun projet pour le moment"}
                </p>
              ) : (
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div
                      id={`project-${project.id}`}
                      key={project.id}
                      className="bg-black border border-gray-800 rounded-lg p-6 transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 animate-fadeIn"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-orange-400 transition duration-300 hover:text-orange-300">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {/* Dropdown pour changer le statut */}
                              <select
                                value={project.status}
                                onChange={(e) => handleStatusChange(project.id, e.target.value as StatutBackend)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)} bg-transparent cursor-pointer`}
                              >
                                <option value="EN_ATTENTE" className="bg-gray-900 text-yellow-400">
                                  {formaterStatut('EN_ATTENTE')} {/* Affiche "En attente" */}
                                </option>
                                <option value="EN_COURS" className="bg-gray-900 text-blue-400">
                                  {formaterStatut('EN_COURS')} {/* Affiche "En cours" */}
                                </option>
                                <option value="TERMINE" className="bg-gray-900 text-green-400">
                                  {formaterStatut('TERMINE')} {/* Affiche "Terminé" */}
                                </option>
                              </select>
                              {(projects.filter(p => formaterStatut(p.status) === 'Terminé').length) && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30 flex items-center gap-1">
                                  🌐 Publié sur le site
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                            <span>📅 Créé le {project.date}</span>
                            <span>👤 Client: {project.client}</span>
                            <span>⏳ Durée: {project.duration}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-orange-400 hover:text-orange-300 transition duration-300 transform hover:scale-110 font-medium px-3 py-1 rounded border border-orange-500 hover:bg-orange-500 hover:text-black text-sm"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-400 hover:text-red-300 transition duration-300 transform hover:scale-110 font-medium px-3 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-black text-sm"
                          >
                            🗑 Supprimer
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 leading-relaxed transition duration-300 hover:text-white">
                        {project.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="text-orange-300 font-medium mb-2">Technologies utilisées:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/50 text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Indication de publication */}
                        {(projects.filter(p => formaterStatut(p.status) === 'Terminé').length) && (
                          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-green-400 text-sm flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                              Ce projet est visible sur la page publique "Nos Réalisations"
                            </p>
                          </div>
                        )}

                        {projects.filter(p => formaterStatut(p.status) === 'Terminé').length && (
                          <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-400 text-sm flex items-center gap-2">
                              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                              Changez le statut en "Terminé" pour publier ce projet sur le site
                            </p>
                          </div>
                        )}
                      </div>

                      {project.url && (
                        <div className="mb-4">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition duration-300 font-medium px-3 py-1 rounded border border-orange-500 hover:bg-orange-500 hover:text-black"
                          >
                            🔗 Voir le projet
                          </a>
                        </div>
                      )}
                      {(project.imagePreview || project.imageUrl) && (
                        <img
                          src={project.imagePreview || project.imageUrl}
                          alt={project.title}
                          className="h-64 w-full object-cover rounded-lg border-2 border-orange-500 transition duration-300 hover:scale-[1.01] shadow-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.5s ease-out forwards;
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.5s ease-out forwards;
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.5s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
