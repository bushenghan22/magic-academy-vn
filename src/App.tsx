import React, { useEffect, useState } from 'react';
import { useGameStore } from './systems/store';
import { TitleScreen } from './components/screens/TitleScreen';
import { GameScreen } from './components/screens/GameScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { LoadScreen } from './components/screens/LoadScreen';
import { GalleryScreen } from './components/screens/GalleryScreen';
import { CharacterViewerScreen } from './components/screens/CharacterViewerScreen';
import { AchievementScreen } from './components/screens/AchievementScreen';
import { HelpScreen } from './components/screens/HelpScreen';
import { EndingScreen } from './components/screens/EndingScreen';
import { StoryFlowScreen } from './components/screens/StoryFlowScreen';
import { TutorialOverlay } from './components/ui/TutorialOverlay';
import MagicParticles from './components/effects/MagicParticles';
import { TransitionEffect } from './components/effects/TransitionEffect';
import { ToastContainer } from './components/ui/Toast';
import { AudioManager } from './systems/audio/AudioManager';

type Screen = 'title' | 'game' | 'settings' | 'load' | 'gallery' | 'characters' | 'achievements' | 'help' | 'ending' | 'flow';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<string>('fade');
  const [playerName, setPlayerName] = useState('星辉');
  const [showNameInput, setShowNameInput] = useState(false);
  const { gameState, showTutorial, startNewGame: storeStartNewGame, returnToTitle } = useGameStore();

  // 监听store的currentScreen变化（用于结局跳转）
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state) => {
      if (state.currentScreen === 'ending' && currentScreen !== 'ending') {
        setIsTransitioning(true);
        setTransitionType('fade');
        setTimeout(() => {
          setCurrentScreen('ending');
          setIsTransitioning(false);
        }, 500);
      }
      if (state.currentScreen === 'game' && currentScreen === 'flow') {
        setIsTransitioning(true);
        setTransitionType('fade');
        setTimeout(() => {
          setCurrentScreen('game');
          setIsTransitioning(false);
        }, 300);
      }
    });
    return unsubscribe;
  }, [currentScreen]);

  useEffect(() => {
    AudioManager.getInstance().initialize();
    return () => {
      AudioManager.getInstance().cleanup();
    };
  }, []);

  const navigateTo = (screen: Screen, transition: string = 'fade') => {
    setIsTransitioning(true);
    setTransitionType(transition);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 500);
  };

  const startNewGame = () => {
    setShowNameInput(true);
  };

  const confirmNewGame = (name: string) => {
    setShowNameInput(false);
    storeStartNewGame(name || '星辉');
    navigateTo('game', 'magic-circle');
  };

  const continueGame = () => {
    navigateTo('game', 'fade');
  };

  const handleEndingReturn = () => {
    returnToTitle();
    setIsTransitioning(true);
    setTransitionType('fade');
    setTimeout(() => {
      setCurrentScreen('title');
      setIsTransitioning(false);
    }, 500);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return (
          <TitleScreen
            onNewGame={startNewGame}
            onContinue={continueGame}
            onSettings={() => navigateTo('settings')}
            onLoad={() => navigateTo('load')}
            onGallery={() => navigateTo('gallery')}
            onCharacters={() => navigateTo('characters')}
            onAchievements={() => navigateTo('achievements')}
            onHelp={() => navigateTo('help')}
          />
        );
      case 'game':
        return (
          <GameScreen
            onTitle={() => navigateTo('title', 'fade')}
            onSettings={() => navigateTo('settings')}
            onFlow={() => navigateTo('flow')}
            onSave={() => {/* handled in game */}}
          />
        );
      case 'flow':
        return (
          <StoryFlowScreen
            onBack={() => navigateTo(gameState ? 'game' : 'title')}
          />
        );
      case 'ending':
        return (
          <EndingScreen
            onTitle={handleEndingReturn}
            onLoad={() => navigateTo('load')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onBack={() => navigateTo(gameState ? 'game' : 'title')}
          />
        );
      case 'load':
        return (
          <LoadScreen
            onBack={() => navigateTo(gameState ? 'game' : 'title')}
            onLoad={(slotId) => {
              navigateTo('game', 'fade');
            }}
          />
        );
      case 'gallery':
        return (
          <GalleryScreen
            onBack={() => navigateTo(gameState ? 'game' : 'title')}
          />
        );
      case 'characters':
        return (
          <CharacterViewerScreen
            onBack={() => navigateTo('title')}
          />
        );
      case 'achievements':
        return (
          <AchievementScreen
            onBack={() => navigateTo('title')}
          />
        );
      case 'help':
        return (
          <HelpScreen
            onBack={() => navigateTo(gameState ? 'game' : 'title')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <MagicParticles />
      <TransitionEffect
        isActive={isTransitioning}
        type={transitionType}
      />
      <div className="screen-container">
        {renderScreen()}
      </div>
      {showTutorial && <TutorialOverlay />}
      <ToastContainer />

      {/* 名字输入对话框 */}
      {showNameInput && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(26,10,46,0.95), rgba(13,4,26,0.98))',
            border: '1px solid rgba(139,111,206,0.4)',
            borderRadius: '16px', padding: '40px', width: '400px',
            boxShadow: '0 0 40px rgba(139,111,206,0.2)',
          }}>
            <h3 style={{
              fontFamily: "'Cinzel', serif", color: '#e0d0ff', marginBottom: '8px',
              fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.05em',
            }}>
              请输入你的名字
            </h3>
            <p style={{
              color: '#706888', fontSize: '0.85rem', textAlign: 'center', marginBottom: '24px',
            }}>
              这将是你在星辉魔法学院中的名字
            </p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmNewGame(playerName); }}
              maxLength={10}
              autoFocus
              style={{
                width: '100%', padding: '12px 16px', background: 'rgba(26,10,46,0.6)',
                border: '1px solid rgba(139,111,206,0.3)', borderRadius: '8px',
                color: '#e0d8f0', fontSize: '1rem', outline: 'none',
                fontFamily: "'Noto Sans SC', sans-serif", textAlign: 'center',
                marginBottom: '20px',
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowNameInput(false)}
                style={{
                  flex: 1, padding: '10px', background: 'transparent',
                  border: '1px solid rgba(139,111,206,0.3)', borderRadius: '8px',
                  color: '#a098b8', cursor: 'pointer', fontSize: '0.95rem',
                }}
              >
                取消
              </button>
              <button
                onClick={() => confirmNewGame(playerName)}
                style={{
                  flex: 1, padding: '10px',
                  background: 'linear-gradient(135deg, #3d2a6e, #5a3f9e)',
                  border: '1px solid rgba(139,111,206,0.5)', borderRadius: '8px',
                  color: '#fff', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
                  boxShadow: '0 0 15px rgba(90,63,158,0.3)',
                }}
              >
                开始冒险
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
