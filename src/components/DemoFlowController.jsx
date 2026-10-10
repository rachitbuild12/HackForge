import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  ExternalLink,
  Shield,
  Users,
  Cpu,
  Zap,
  Target,
  Compass,
  GitBranch,
  GitCommit,
  CheckCircle,
  Lock,
  Award,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import { DEMO_STEPS, DEMO_HACKATHON_ID } from '../data/demoModeData';

export default function DemoFlowController() {
  const {
    isDemoMode,
    demoStep,
    nextDemoStep,
    prevDemoStep,
    jumpToDemoStep,
    exitDemoMode,
    isAutoPlaying,
    setIsAutoPlaying,
    switchRole
  } = useHackForge();

  const navigate = useNavigate();
  const location = useLocation();

  const [isMinimized, setIsMinimized] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(12);

  const currentStepObj = DEMO_STEPS.find(s => s.step === demoStep) || DEMO_STEPS[0];

  // Auto-play timer effect: advance every 12 seconds if playing
  useEffect(() => {
    let timer;
    if (isDemoMode && isAutoPlaying) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            if (demoStep < 12) {
              const nextStep = demoStep + 1;
              jumpToDemoStep(nextStep);
              const nextObj = DEMO_STEPS.find(s => s.step === nextStep);
              if (nextObj) {
                navigate(nextObj.route);
                switchRole(nextObj.role);
              }
              return 12;
            } else {
              setIsAutoPlaying(false);
              return 12;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSecondsRemaining(12);
    }
    return () => clearInterval(timer);
  }, [isDemoMode, isAutoPlaying, demoStep, jumpToDemoStep, navigate, switchRole, setIsAutoPlaying]);

  if (!isDemoMode) return null;

  const handleNext = () => {
    if (demoStep < 12) {
      const nextStep = demoStep + 1;
      jumpToDemoStep(nextStep);
      const nextObj = DEMO_STEPS.find(s => s.step === nextStep);
      if (nextObj) {
        navigate(nextObj.route);
        switchRole(nextObj.role);
      }
      setSecondsRemaining(12);
    }
  };

  const handlePrev = () => {
    if (demoStep > 1) {
      const pStep = demoStep - 1;
      jumpToDemoStep(pStep);
      const pObj = DEMO_STEPS.find(s => s.step === pStep);
      if (pObj) {
        navigate(pObj.route);
        switchRole(pObj.role);
      }
      setSecondsRemaining(12);
    }
  };

  const handleSelectStep = (stepNum) => {
    jumpToDemoStep(stepNum);
    const target = DEMO_STEPS.find(s => s.step === stepNum);
    if (target) {
      navigate(target.route);
      switchRole(target.role);
    }
    setSecondsRemaining(12);
  };

  const handleNavigateCurrent = () => {
    if (location.pathname !== currentStepObj.route) {
      navigate(currentStepObj.route);
      switchRole(currentStepObj.role);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'organizer':
        return { label: '🛡️ Organizer Perspective', color: 'var(--accent-violet)' };
      case 'team_leader':
        return { label: '🚀 Team Leader Perspective', color: 'var(--accent-cyan)' };
      case 'participant':
        return { label: '⚡ Participant Perspective', color: 'var(--accent-emerald)' };
      case 'judge':
        return { label: '⚖️ Judge Perspective', color: 'var(--accent-amber)' };
      default:
        return { label: '👤 Observer', color: 'var(--accent-cyan)' };
    }
  };

  const roleInfo = getRoleBadge(currentStepObj.role);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        maxWidth: isMinimized ? '340px' : '580px',
        width: 'calc(100vw - 48px)',
        background: 'rgba(11, 15, 23, 0.94)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.25)',
        color: '#fff',
        fontFamily: 'var(--font-sans)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.08))',
          borderRadius: isMinimized ? 'var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) 0 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #06b6d4, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 800
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.86rem', letterSpacing: '-0.01em', color: '#fff' }}>
                HACKFORGE DEMO MODE
              </span>
              <span
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--accent-amber)',
                  fontSize: '0.62rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)'
                }}
              >
                SIMULATED DATA
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              Step {demoStep} of 12 • ETHGlobal Autonomous 2026
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isAutoPlaying && (
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--accent-emerald)',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }} />
              Next in {secondsRemaining}s
            </span>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="btn btn-ghost btn-sm"
            style={{ width: '28px', height: '28px', padding: 0 }}
            title={isMinimized ? "Expand Demo Controller" : "Minimize Demo Controller"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>

          <button
            onClick={exitDemoMode}
            className="btn btn-ghost btn-sm"
            style={{ width: '28px', height: '28px', padding: 0, color: 'var(--accent-rose)' }}
            title="Exit Demo Mode"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Expanded Controller Content */}
      {!isMinimized && (
        <div style={{ padding: '16px 20px' }}>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
            <div
              style={{
                width: `${(demoStep / 12) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          {/* Current Step Headline & Perspective */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: roleInfo.color,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {roleInfo.label}
              </span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {currentStepObj.headline}
              </h3>
            </div>

            <button
              onClick={handleNavigateCurrent}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '4px 10px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Inspect View</span>
              <ExternalLink size={11} />
            </button>
          </div>

          {/* Step Description */}
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
            {currentStepObj.description}
          </p>

          {/* Interactive Navigation & Playback Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            {/* Step Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={demoStep}
                onChange={e => handleSelectStep(parseInt(e.target.value))}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '5px 8px',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                {DEMO_STEPS.map(s => (
                  <option key={s.step} value={s.step}>
                    {s.step}. {s.shortName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`btn btn-sm ${isAutoPlaying ? 'btn-secondary' : 'btn-ghost'}`}
                style={{
                  padding: '5px 10px',
                  height: 'auto',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: isAutoPlaying ? 'var(--accent-emerald)' : 'var(--text-secondary)'
                }}
                title={isAutoPlaying ? "Pause 5-minute auto tour" : "Auto-advance through all 12 steps"}
              >
                {isAutoPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                <span>{isAutoPlaying ? 'Pause Tour' : 'Auto-Play (5m)'}</span>
              </button>
            </div>

            {/* Prev / Next Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handlePrev}
                disabled={demoStep <= 1}
                className="btn btn-secondary btn-sm"
                style={{
                  padding: '5px 12px',
                  height: 'auto',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: demoStep <= 1 ? 0.4 : 1
                }}
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNext}
                disabled={demoStep >= 12}
                className="btn btn-primary btn-sm"
                style={{
                  padding: '5px 16px',
                  height: 'auto',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 16px rgba(6,182,212,0.3)',
                  opacity: demoStep >= 12 ? 0.4 : 1
                }}
              >
                <span>{demoStep === 12 ? 'Finish Demo' : 'Next Step'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Pill View */}
      {isMinimized && (
        <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Step <strong style={{ color: 'var(--accent-cyan)' }}>{demoStep}</strong>: {currentStepObj.shortName}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handlePrev}
              disabled={demoStep <= 1}
              className="btn btn-ghost btn-sm"
              style={{ width: '26px', height: '26px', padding: 0 }}
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={handleNext}
              disabled={demoStep >= 12}
              className="btn btn-primary btn-sm"
              style={{ width: '26px', height: '26px', padding: 0 }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
