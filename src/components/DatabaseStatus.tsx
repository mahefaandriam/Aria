import { useState, useEffect } from 'react';
import { healthApi } from '@/services/api';

const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [uptime, setUptime] = useState<number>(0);
  const [lastCheck, setLastCheck] = useState<string>('');

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await healthApi.checkHealth();
        setIsConnected(true);
        setUptime(response.data?.uptime || 0);
        setLastCheck(new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }));
      } catch (error) {
        setIsConnected(false);
        setLastCheck(new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }));
      }
    };

    // Vérifier immédiatement
    checkDatabaseStatus();

    // Vérifier toutes les 15 secondes
    const interval = setInterval(checkDatabaseStatus, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (isConnected === null) {
    return (
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm">Vérification de la connexion...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-b px-4 py-2 ${
      isConnected 
        ? 'bg-green-900/30 border-green-500/30' 
        : 'bg-red-900/30 border-red-500/30'
    }`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${
            isConnected 
              ? 'bg-green-500 animate-pulse' 
              : 'bg-red-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            isConnected ? 'text-green-400' : 'text-red-400'
          }`}>
            {isConnected ? '🚀 Base de données connectée' : '❌ Base de données déconnectée'}
          </span>
          {isConnected && (
            <span className="text-green-300 text-xs">
              | 📡 API opérationnelle | ⏱️ Uptime: {formatUptime(uptime)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            Dernière vérification: {lastCheck}
          </span>
          {!isConnected && (
            <span className="text-red-300 text-xs bg-red-900/50 px-2 py-1 rounded">
              Backend non disponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;
