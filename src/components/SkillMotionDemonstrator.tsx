import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Sparkles, Image as ImageIcon, Film } from 'lucide-react';

interface SkillMotionDemonstratorProps {
  archetype?: 'loom' | 'steam' | 'lineman' | 'assembly' | 'cad' | 'ai' | 'chemistry' | 'code' | 'medical' | 'general' | 'telegraph' | 'telephone' | 'bio';
  imagePath?: string;
  skillName: string;
  category: 'obsolescent' | 'transformed' | 'emergent';
  eraFallbackImage?: string;
}

export const SkillMotionDemonstrator: React.FC<SkillMotionDemonstratorProps> = ({
  archetype = 'general',
  imagePath,
  skillName,
  category,
  eraFallbackImage,
}) => {
  // Resolve effective still image path: use specific skill image, or era fallback, or archetype mapped image
  const resolvedImagePath = imagePath || eraFallbackImage || '/src/assets/images/first_industrial_rev_1790713511871.jpg';

  // Always default to 'image' (Archival Still) per user preference!
  const [viewMode, setViewMode] = useState<'image' | 'animation'>('image');
  const [isPlaying, setIsPlaying] = useState(true);
  const [frame, setFrame] = useState(0);

  // Animation frame loop
  useEffect(() => {
    if (!isPlaying || viewMode !== 'animation') return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 360);
    }, 40); // 25 FPS smooth kinetic motion
    return () => clearInterval(interval);
  }, [isPlaying, viewMode]);

  const primaryColor =
    category === 'obsolescent' ? '#f97316' : category === 'transformed' ? '#f59e0b' : '#38bdf8';

  // Render specific animated kinetic simulation
  const renderKineticSimulation = () => {
    switch (archetype) {
      case 'loom': {
        // Flying shuttle moving left to right, warp yarn splitting
        const shuttleX = 40 + Math.sin(frame * 0.1) * 120 + 120; // 40 to 280
        const isUp = Math.sin(frame * 0.1) > 0;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            {/* Wooden Loom Frame */}
            <rect x="20" y="20" width="320" height="160" fill="#0b1220" stroke="#334155" strokeWidth="2" rx="6" />
            <line x1="30" y1="35" x2="330" y2="35" stroke="#475569" strokeWidth="4" />
            <line x1="30" y1="165" x2="330" y2="165" stroke="#475569" strokeWidth="4" />

            {/* Vertical Warp Threads */}
            {Array.from({ length: 24 }).map((_, i) => {
              const x = 40 + i * 12;
              const offset = i % 2 === 0 ? (isUp ? -8 : 8) : (isUp ? 8 : -8);
              return (
                <line
                  key={i}
                  x1={x}
                  y1={38}
                  x2={x}
                  y2={162}
                  stroke={i % 2 === 0 ? '#94a3b8' : '#64748b'}
                  strokeWidth="1.2"
                  strokeDasharray={offset > 0 ? '4 2' : 'none'}
                />
              );
            })}

            {/* Reed Batten Beater swinging */}
            <line
              x1="35"
              y1={100 + Math.cos(frame * 0.1) * 6}
              x2="325"
              y2={100 + Math.cos(frame * 0.1) * 6}
              stroke="#64748b"
              strokeWidth="2.5"
            />

            {/* Flying Wooden Shuttle with Pirn bobbin */}
            <g transform={`translate(${shuttleX - 25}, 90)`}>
              <rect x="0" y="0" width="50" height="18" rx="9" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
              <circle cx="25" cy="9" r="4" fill="#ffffff" />
              {/* Yarn trailing trail */}
              <path
                d={`M 25 9 Q ${25 - (shuttleX > 160 ? 35 : -35)} ${Math.sin(frame * 0.3) * 10 + 9} ${shuttleX > 160 ? 0 : 50} 9`}
                fill="none"
                stroke="#fed7aa"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </g>

            {/* Foot Treadle Cycling at bottom */}
            <rect x="120" y="172" width="50" height="8" rx="2" fill={isUp ? '#f97316' : '#334155'} />
            <rect x="190" y="172" width="50" height="8" rx="2" fill={!isUp ? '#f97316' : '#334155'} />

            {/* Telemetry HUD overlay */}
            <text x="35" y="30" fill="#f97316" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: FLYING SHUTTLE AT 120 PICKS/MIN
            </text>
            <text x="325" y="30" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">
              TREADLE CYCLE: {isUp ? 'SHED A' : 'SHED B'}
            </text>
          </svg>
        );
      }

      case 'steam': {
        // Steam cylinder piston reciprocating + centrifugal governor spinning
        const pistonY = 70 + Math.sin(frame * 0.15) * 25; // 45 to 95
        const govAngle = frame * 0.2;
        const govSpread = 10 + Math.abs(Math.sin(frame * 0.05)) * 12;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#090d18" stroke="#334155" strokeWidth="2" rx="6" />

            {/* Steam Boiler Cylinder */}
            <rect x="40" y="55" width="85" height="100" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4" />
            <text x="82" y="72" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
              CONDENSING CYLINDER
            </text>

            {/* Moving Piston Head */}
            <rect x="44" y={pistonY} width="77" height="16" fill="#f97316" stroke="#fed7aa" strokeWidth="1.5" rx="2" />
            <line x1="82" y1={pistonY + 8} x2="82" y2="35" stroke="#cbd5e1" strokeWidth="4" />

            {/* Steam Pressure Gauge Dial */}
            <circle cx="165" cy="80" r="24" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
            <text x="165" y="72" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
              PSI
            </text>
            <line
              x1="165"
              y1="80"
              x2={165 + Math.cos(frame * 0.08) * 18}
              y2={80 + Math.sin(frame * 0.08) * 18}
              stroke="#ef4444"
              strokeWidth="2"
            />
            <circle cx="165" cy="80" r="3" fill="#cbd5e1" />

            {/* Watt Centrifugal Governor */}
            <g transform="translate(255, 65)">
              <line x1="0" y1="0" x2="0" y2="75" stroke="#94a3b8" strokeWidth="3" />
              {/* Flyballs rotating */}
              <circle cx={-govSpread} cy={30 + Math.sin(govAngle) * 4} r="8" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
              <line x1="0" y1="10" x2={-govSpread} y2={30 + Math.sin(govAngle) * 4} stroke="#cbd5e1" strokeWidth="2" />
              <circle cx={govSpread} cy={30 - Math.sin(govAngle) * 4} r="8" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
              <line x1="0" y1="10" x2={govSpread} y2={30 - Math.sin(govAngle) * 4} stroke="#cbd5e1" strokeWidth="2" />
              <text x="0" y="95" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                CENTRIFUGAL GOVERNOR
              </text>
            </g>

            {/* Steam Exhaust Steam Plumes */}
            {Array.from({ length: 4 }).map((_, i) => (
              <circle
                key={i}
                cx={128 + i * 8}
                cy={135 - ((frame + i * 20) % 40)}
                r={4 + (frame % 8)}
                fill="#ffffff"
                opacity={Math.max(0, 0.4 - ((frame + i * 20) % 40) / 100)}
              />
            ))}

            <text x="35" y="32" fill="#f97316" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: RECIPROCATING CONDENSING PISTON
            </text>
          </svg>
        );
      }

      case 'lineman': {
        // High voltage power pole, swaying snow particles, spark corona discharge
        const sparkActive = frame % 18 < 6;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#040914" stroke="#1e293b" strokeWidth="2" rx="6" />

            {/* Wooden Utility Pole */}
            <rect x="170" y="40" width="20" height="140" fill="#3f2e1e" stroke="#5c442c" strokeWidth="1.5" />
            {/* Cross arms */}
            <rect x="100" y="55" width="160" height="10" fill="#5c442c" stroke="#78593a" strokeWidth="1" />
            <rect x="120" y="85" width="120" height="10" fill="#5c442c" stroke="#78593a" strokeWidth="1" />

            {/* Ceramic Insulator Bushings */}
            {[110, 145, 215, 250].map((x, i) => (
              <rect key={i} x={x} y="47" width="10" height="10" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1" rx="2" />
            ))}

            {/* High-voltage Conductor Cables vibrating */}
            <path
              d={`M 20 52 Q 120 ${54 + Math.sin(frame * 0.2) * 2} 180 52 T 340 52`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
            />
            <path
              d={`M 20 82 Q 130 ${84 - Math.sin(frame * 0.2) * 2} 180 82 T 340 82`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2.5"
            />

            {/* Lineman Silhouette climbing with belt */}
            <g transform="translate(182, 90)">
              {/* Safety strap wrapping pole */}
              <path d="M -15 25 C -25 35, -25 45, -15 50" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              {/* Torso */}
              <circle cx="15" cy="18" r="7" fill="#f97316" />
              <rect x="8" y="26" width="14" height="26" rx="3" fill="#ea580c" />
              {/* Pliers reaching to insulator */}
              <line x1="16" y1="30" x2="-25" y2="4" stroke="#ffffff" strokeWidth="2" />
              {/* Insulated gloves */}
              <circle cx="-25" cy="4" r="3.5" fill="#38bdf8" />
            </g>

            {/* Corona Arc Sparks */}
            {sparkActive && (
              <g transform="translate(152, 92)">
                <line x1="0" y1="0" x2="-8" y2="-10" stroke="#38bdf8" strokeWidth="2" />
                <line x1="0" y1="0" x2="6" y2="-12" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="-6" y2="8" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4" fill="#67e8f9" opacity="0.8" />
              </g>
            )}

            {/* Snow drift flakes */}
            {Array.from({ length: 15 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 26 + frame * 3) % 340 + 20}
                cy={(i * 18 + frame * 2) % 150 + 25}
                r="1.2"
                fill="#ffffff"
                opacity="0.6"
              />
            ))}

            <text x="35" y="32" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: 10,000V LIVE-LINE TRANSFORMER SPLICE
            </text>
          </svg>
        );
      }

      case 'cad': {
        // CAD 3D wireframe isometric cube rotating with green cursor crosshair snapping
        const rot = frame * 0.03;
        const snapActive = frame % 40 < 20;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            {/* CRT Monitor Frame */}
            <rect x="20" y="20" width="320" height="160" fill="#021a12" stroke="#064e3b" strokeWidth="3" rx="8" />

            {/* Phosphor Grid Lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`x-${i}`} x1={30 + i * 35} y1={25} x2={30 + i * 35} y2={175} stroke="#047857" strokeWidth="0.5" opacity="0.3" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`y-${i}`} x1={25} y1={30 + i * 32} x2={335} y2={30 + i * 32} stroke="#047857" strokeWidth="0.5" opacity="0.3" />
            ))}

            {/* Rotating 3D Isometric Geometric Assembly */}
            <g transform="translate(180, 100)">
              {/* Isometric Cube Wireframe */}
              <polygon
                points={`
                  ${Math.cos(rot) * 50},${Math.sin(rot) * 25 - 30}
                  ${Math.cos(rot + 1.5) * 50},${Math.sin(rot + 1.5) * 25 - 30}
                  ${Math.cos(rot + 3.1) * 50},${Math.sin(rot + 3.1) * 25 - 30}
                  ${Math.cos(rot + 4.7) * 50},${Math.sin(rot + 4.7) * 25 - 30}
                `}
                fill="#065f46"
                fillOpacity="0.3"
                stroke="#34d399"
                strokeWidth="1.5"
              />
              <polygon
                points={`
                  ${Math.cos(rot) * 50},${Math.sin(rot) * 25 + 30}
                  ${Math.cos(rot + 1.5) * 50},${Math.sin(rot + 1.5) * 25 + 30}
                  ${Math.cos(rot + 3.1) * 50},${Math.sin(rot + 3.1) * 25 + 30}
                  ${Math.cos(rot + 4.7) * 50},${Math.sin(rot + 4.7) * 25 + 30}
                `}
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              {/* Connecting Pillars */}
              {[0, 1.5, 3.1, 4.7].map((angle, i) => (
                <line
                  key={i}
                  x1={Math.cos(rot + angle) * 50}
                  y1={Math.sin(rot + angle) * 25 - 30}
                  x2={Math.cos(rot + angle) * 50}
                  y2={Math.sin(rot + angle) * 25 + 30}
                  stroke="#6ee7b7"
                  strokeWidth="1.2"
                />
              ))}

              {/* Dimension measurement tolerance callout */}
              <line x1="-55" y1="-30" x2="-55" y2="30" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />
              <text x="-60" y="3" fill="#fbbf24" fontSize="8" fontFamily="monospace" textAnchor="end">
                60.00 ± 0.05 mm
              </text>
            </g>

            {/* CAD Crosshair Cursor */}
            <g transform={`translate(${180 + Math.cos(rot) * 50}, ${100 + Math.sin(rot) * 25 - 30})`}>
              <circle cx="0" cy="0" r={snapActive ? 6 : 3} fill="none" stroke="#f43f5e" strokeWidth="1.5" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#f43f5e" strokeWidth="1" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#f43f5e" strokeWidth="1" />
              {snapActive && (
                <text x="8" y="-8" fill="#f43f5e" fontSize="7" fontFamily="monospace">
                  SNAP: ENDPOINT
                </text>
              )}
            </g>

            <text x="35" y="34" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: 3D PARAMETRIC SOLID MODELING & TOLERANCE
            </text>
          </svg>
        );
      }

      case 'assembly': {
        // Ford moving conveyor chain with car chassis and pneumatic torque wrench
        const conveyorX = (frame * 2.5) % 80;
        const toolDown = (frame % 50) > 25;
        const sparkBurst = toolDown && (frame % 50) < 40;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#070c18" stroke="#1e293b" strokeWidth="2" rx="6" />
            
            {/* Overhead Conveyor Rail & Trolley Hangers */}
            <line x1="30" y1="45" x2="330" y2="45" stroke="#475569" strokeWidth="4" />
            {Array.from({ length: 8 }).map((_, i) => {
              const x = 40 + i * 40 - conveyorX;
              if (x < 25 || x > 335) return null;
              return (
                <g key={i}>
                  <rect x={x - 4} y="41" width="8" height="8" rx="2" fill="#94a3b8" />
                  <line x1={x} y1="49" x2={x} y2="85" stroke="#64748b" strokeWidth="1.5" />
                </g>
              );
            })}

            {/* Moving Chassis Carriage Frame */}
            <g transform="translate(110, 85)">
              <rect x="0" y="0" width="140" height="35" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              {/* Wheels / Hubs */}
              <circle cx="25" cy="40" r="14" fill="#0f172a" stroke="#f97316" strokeWidth="2.5" />
              <circle cx="115" cy="40" r="14" fill="#0f172a" stroke="#f97316" strokeWidth="2.5" />
              {/* Chassis Crossbars */}
              <line x1="20" y1="18" x2="120" y2="18" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
              {/* Cylinder head block */}
              <rect x="45" y="-12" width="50" height="12" fill="#334155" stroke="#94a3b8" strokeWidth="1" rx="2" />
              {/* 4 Bolts */}
              {[55, 65, 75, 85].map((bx, bi) => (
                <circle key={bi} cx={bx} cy="-6" r="2.5" fill="#f8fafc" />
              ))}
            </g>

            {/* Pneumatic Torque Wrench suspended from balancer */}
            <g transform={`translate(175, ${toolDown ? 65 : 45})`}>
              <path d="M 0 -20 Q 8 -10 0 0" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
              <rect x="-6" y="0" width="12" height="22" rx="2" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
              <rect x="-2" y="22" width="4" height="12" fill="#cbd5e1" />
              {/* Handle */}
              <rect x="-14" y="6" width="8" height="4" rx="1" fill="#475569" />
              {/* Tightening Sparks */}
              {sparkBurst && (
                <g transform="translate(0, 34)">
                  <line x1="0" y1="0" x2="-8" y2="-6" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="9" y2="-5" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="6" y2="6" stroke="#f97316" strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="-7" y2="5" stroke="#fbbf24" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="3" fill="#ffffff" />
                </g>
              )}
            </g>

            {/* Assembly Floor Rail Tracks */}
            <line x1="30" y1="140" x2="330" y2="140" stroke="#334155" strokeWidth="3" />
            <line x1="30" y1="148" x2="330" y2="148" stroke="#1e293b" strokeWidth="2" />

            {/* Ford Takt Timer & Telemetry HUD */}
            <rect x="35" y="156" width="290" height="18" fill="#030712" stroke="#1e293b" rx="3" />
            <text x="45" y="169" fill="#f59e0b" fontSize="8" fontFamily="monospace">
              CYCLE TAKT: 48.0s | TORQUE SPEC: 45 FT-LBS | 4/4 NUTS FASTENED
            </text>
            <text x="35" y="34" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: FORD HIGHLAND PARK MOVING CONTINUOUS ASSEMBLY
            </text>
          </svg>
        );
      }

      case 'chemistry': {
        // High-pressure catalytic autoclave reactor & fractional distillation column
        const boilY = 120 + Math.sin(frame * 0.3) * 4;
        const bubbleOffset = (frame * 2) % 60;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#050a16" stroke="#1e293b" strokeWidth="2" rx="6" />

            {/* Main Autoclave High-Pressure Vessel */}
            <rect x="50" y="45" width="80" height="100" rx="20" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            {/* Liquid level */}
            <path d={`M 52 ${boilY} Q 90 ${boilY - 4} 128 ${boilY} L 128 125 Q 90 145 52 125 Z`} fill="#0284c7" opacity="0.4" />
            
            {/* Bubbling catalytic vapor */}
            {Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={i}
                cx={65 + i * 14}
                cy={130 - ((bubbleOffset + i * 15) % 65)}
                r={2.5 + (i % 2)}
                fill="#7dd3fc"
                opacity={0.8}
              />
            ))}

            {/* Heating Mantle Glow */}
            <path d="M 45 135 Q 90 155 135 135" fill="none" stroke="#f97316" strokeWidth="4" />

            {/* Transfer Condensation Pipeline with Spiral Coil */}
            <path d="M 90 45 L 90 35 L 180 35 L 180 60" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
            {/* Cooling Coil Box */}
            <rect x="165" y="60" width="30" height="60" fill="#082f49" stroke="#0ea5e9" strokeWidth="1" rx="4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <path key={i} d={`M 170 ${68 + i * 12} Q 180 ${74 + i * 12} 190 ${68 + i * 12}`} fill="none" stroke="#38bdf8" strokeWidth="2" />
            ))}

            {/* Pressure Manometer Dial (200 Atmospheres) */}
            <g transform="translate(265, 85)">
              <circle cx="0" cy="0" r="30" fill="#0b1329" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="-12" fill="#94a3b8" fontSize="7" fontFamily="monospace" textAnchor="middle">
                BAR / ATM
              </text>
              <text x="0" y="16" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                200.0 ATM
              </text>
              {/* Dial needle vibrating */}
              <line
                x1="0"
                y1="0"
                x2={Math.cos((frame * 0.05) % 1 - 1.5) * 22}
                y2={Math.sin((frame * 0.05) % 1 - 1.5) * 22}
                stroke="#ef4444"
                strokeWidth="2"
              />
              <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
            </g>

            {/* Exhaust Flare / Valve */}
            <line x1="180" y1="120" x2="180" y2="145" stroke="#94a3b8" strokeWidth="2" />
            <rect x="175" y="145" width="10" height="6" fill="#f59e0b" rx="1" />

            <text x="35" y="34" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: CONTINUOUS CATALYTIC SYNTHESIS AT 200 ATMOSPHERE
            </text>
            <text x="50" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              HABER-BOSCH HIGH-PRESSURE AUTOCLAVE NITROGEN FIXATION
            </text>
          </svg>
        );
      }

      case 'telegraph': {
        // Brass telegraph key lever clicking with sparks and paper ticker tape
        const isDepressed = (frame % 24) < 10;
        const spark = isDepressed && (frame % 24) < 4;
        const tapeShift = (frame * 1.5) % 120;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#060913" stroke="#1e293b" strokeWidth="2" rx="6" />

            {/* Polished Mahogany Wood Base */}
            <rect x="40" y="125" width="180" height="25" rx="3" fill="#311e11" stroke="#5c381e" strokeWidth="2" />

            {/* Brass Pivot Posts */}
            <rect x="115" y="90" width="14" height="35" rx="2" fill="#d97706" stroke="#fde68a" strokeWidth="1" />
            <circle cx="122" cy="100" r="3" fill="#ffffff" />

            {/* Electromagnetic Twin Coils */}
            <rect x="55" y="100" width="22" height="25" rx="2" fill="#78350f" stroke="#b45309" strokeWidth="1" />
            <rect x="82" y="100" width="22" height="25" rx="2" fill="#78350f" stroke="#b45309" strokeWidth="1" />
            {/* Copper wire windings */}
            {[105, 110, 115, 120].map((wy, wi) => (
              <line key={wi} x1="55" y1={wy} x2="104" y2={wy} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 1" />
            ))}

            {/* Tilting Brass Rocker Arm */}
            <g transform={`translate(122, 100) rotate(${isDepressed ? 3 : -2}) translate(-122, -100)`}>
              <line x1="55" y1="95" x2="200" y2="95" stroke="#f59e0b" strokeWidth="4" />
              {/* Ebonite Finger Knob */}
              <circle cx="195" cy="90" r="10" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              {/* Lower Platinum Contact Stud */}
              <rect x="62" y="96" width="6" height="6" fill="#cbd5e1" />
            </g>

            {/* Lower Base Contact Stud */}
            <rect x="62" y="120" width="6" height="5" fill="#cbd5e1" />

            {/* Spark Gap Discharge */}
            {spark && (
              <g transform="translate(65, 110)">
                <line x1="0" y1="-5" x2="-6" y2="4" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="0" y1="-5" x2="6" y2="3" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#67e8f9" />
              </g>
            )}

            {/* Paper Ticker Tape Feed Reel */}
            <g transform="translate(275, 80)">
              <circle cx="0" cy="0" r="28" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="8" fill="#f59e0b" />
              {/* Paper Tape unwinding across window */}
              <rect x="-65" y="35" width="100" height="14" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
              {/* Printed Morse dots & dashes */}
              <text x={-60 - tapeShift} y="45" fill="#1c1917" fontSize="8" fontFamily="monospace" fontWeight="bold">
                • • •  — — —  • • •   [WHAT HATH GOD WROUGHT]  • — •
              </text>
            </g>

            <text x="35" y="34" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: AUDITORY MORSE KEY SOUNDER TRANSMISSION
            </text>
            <text x="40" y="165" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              RATE: 38 WORDS/MIN · ACOUSTIC DECODING INTO HANDWRITTEN DISPATCH
            </text>
          </svg>
        );
      }

      case 'telephone': {
        // Bell PBX manual cord switchboard with blinking indicator lamps & patch cables
        const activeJack = Math.floor(frame / 60) % 6;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#040813" stroke="#1e293b" strokeWidth="2" rx="6" />

            {/* Hardwood Switchboard Console Frame */}
            <rect x="35" y="35" width="290" height="135" rx="4" fill="#1a110a" stroke="#5c381e" strokeWidth="2" />

            {/* Jack Socket Grid (4 rows of 8 jacks) */}
            {Array.from({ length: 4 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => {
                const x = 55 + col * 32;
                const y = 52 + row * 22;
                const isRinging = (row * 8 + col) === activeJack && (frame % 20 < 10);
                return (
                  <g key={`${row}-${col}`}>
                    {/* Annunciator Drop / Indicator Lamp */}
                    <circle cx={x} cy={y - 8} r="3" fill={isRinging ? '#f59e0b' : '#334155'} />
                    {/* Brass Jack Socket */}
                    <circle cx={x} cy={y} r="6" fill="#0f172a" stroke="#d97706" strokeWidth="1.2" />
                    <circle cx={x} cy={y} r="2.5" fill="#000000" />
                  </g>
                );
              })
            )}

            {/* Operator Patch Cord with Braided Texture */}
            <path
              d={`M 119 96 C 140 ${140 + Math.sin(frame * 0.1) * 8}, 220 ${150 + Math.sin(frame * 0.1) * 6}, 247 74`}
              fill="none"
              stroke="#ea580c"
              strokeWidth="3.5"
            />
            {/* Plugs inserted in jacks */}
            <rect x="116" y="92" width="6" height="10" rx="1" fill="#cbd5e1" stroke="#f97316" strokeWidth="1" />
            <rect x="244" y="70" width="6" height="10" rx="1" fill="#cbd5e1" stroke="#f97316" strokeWidth="1" />

            {/* Audio Waveform Ripple at Jack 247, 74 */}
            <circle cx="247" cy="74" r={8 + (frame % 16)} fill="none" stroke="#38bdf8" strokeWidth="1" opacity={Math.max(0, 1 - (frame % 16) / 16)} />

            {/* Lower Keyboard Shelf / Listening Keys */}
            <rect x="45" y="132" width="270" height="30" fill="#0c0704" rx="2" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={65 + i * 32} y1="140" x2={65 + i * 32} y2="152" stroke="#94a3b8" strokeWidth="2.5" />
            ))}

            <text x="45" y="47" fill="#f97316" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: PBX MULTIPLE SWITCHBOARD ROUTING
            </text>
            <text x="45" y="156" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
              TRUNK LINE 14 CONNECTED · 3-SECOND AUDIO CONNECTION STANDARD
            </text>
          </svg>
        );
      }

      case 'medical': {
        // CRT monitor ECG waveform rhythm + medical diagnostic image scan with AI bounding box
        const ecgX = (frame * 3) % 200;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#02141a" stroke="#0e7490" strokeWidth="2" rx="6" />

            {/* Left Screen: ECG Cardiopulmonary Lead Tracing */}
            <rect x="35" y="38" width="135" height="124" fill="#04202c" stroke="#0891b2" strokeWidth="1" rx="4" />
            {/* Grid */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`x-${i}`} x1={35 + i * 22} y1="38" x2={35 + i * 22} y2="162" stroke="#083344" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`y-${i}`} x1={35} y1={38 + i * 25} x2={170} y2={38 + i * 25} stroke="#083344" strokeWidth="0.5" />
            ))}
            {/* Heartbeat pulse path */}
            <path
              d="M 35 100 L 70 100 L 75 88 L 80 115 L 85 70 L 90 120 L 95 100 L 135 100 L 140 88 L 145 115 L 150 70 L 155 120 L 160 100 L 170 100"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.8"
            />
            {/* Sweeping phosphor beam */}
            <line x1={35 + ecgX % 135} y1="38" x2={35 + ecgX % 135} y2="162" stroke="#67e8f9" strokeWidth="2" opacity="0.6" />
            <text x="42" y="52" fill="#22d3ee" fontSize="8" fontFamily="monospace" fontWeight="bold">
              HR: 74 BPM | SP02: 99%
            </text>

            {/* Right Screen: Chest Radiograph / CT Slice with AI Bounding Box */}
            <rect x="185" y="38" width="140" height="124" fill="#080c14" stroke="#334155" strokeWidth="1" rx="4" />
            {/* Lung cavity outline */}
            <path d="M 210 65 Q 230 55 245 80 Q 250 120 225 140 Q 205 130 210 65 Z" fill="#1e293b" opacity="0.5" />
            <path d="M 300 65 Q 280 55 265 80 Q 260 120 285 140 Q 305 130 300 65 Z" fill="#1e293b" opacity="0.5" />

            {/* AI Anomaly Detection Bounding Box */}
            <g transform="translate(225, 80)">
              <rect
                x="0"
                y="0"
                width="40"
                height="35"
                fill="none"
                stroke="#f97316"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="2" y="-4" fill="#f97316" fontSize="7" fontFamily="monospace" fontWeight="bold">
                AI CLASSIFY: 99.1%
              </text>
              <line x1="-3" y1="0" x2="3" y2="0" stroke="#f97316" strokeWidth="2" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="#f97316" strokeWidth="2" />
            </g>

            {/* Vertical Laser Scan Line */}
            <line
              x1="185"
              y1={40 + ((frame * 2) % 115)}
              x2="325"
              y2={40 + ((frame * 2) % 115)}
              stroke="#38bdf8"
              strokeWidth="1"
              opacity="0.7"
            />

            <text x="35" y="32" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: MULTIMODAL DIAGNOSTIC CLASSIFICATION & TELEMETRY
            </text>
          </svg>
        );
      }

      case 'bio': {
        // Rotating 3D DNA double helix + AlphaFold protein ribbon folding
        const rot = frame * 0.08;
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#030816" stroke="#1e293b" strokeWidth="2" rx="6" />

            {/* DNA Double Helix Segment (Left to Right) */}
            {Array.from({ length: 14 }).map((_, i) => {
              const x = 45 + i * 19;
              const angle = rot + i * 0.45;
              const y1 = 90 + Math.sin(angle) * 32;
              const y2 = 90 - Math.sin(angle) * 32;
              const z = Math.cos(angle);
              const strand1Color = z > 0 ? '#38bdf8' : '#0284c7';
              const strand2Color = z > 0 ? '#f59e0b' : '#b45309';

              return (
                <g key={i}>
                  {/* Base pair rung */}
                  <line x1={x} y1={y1} x2={x} y2={y2} stroke="#475569" strokeWidth="1.2" opacity="0.6" />
                  {/* Nucleotide spheres */}
                  <circle cx={x} cy={y1} r={3.5 + z * 1.5} fill={strand1Color} stroke="#ffffff" strokeWidth="0.5" />
                  <circle cx={x} cy={y2} r={3.5 - z * 1.5} fill={strand2Color} stroke="#ffffff" strokeWidth="0.5" />
                </g>
              );
            })}

            {/* AlphaFold Protein Ribbon Spline Overlay */}
            <path
              d={`M 80 145 C 140 ${165 + Math.sin(rot) * 10}, 200 ${110 - Math.sin(rot) * 12}, 260 145 S 310 ${120 + Math.cos(rot) * 8}, 320 135`}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />

            {/* Molecular Docking Lock Coordinate Box */}
            <rect x="210" y="45" width="115" height="40" fill="#090f24" stroke="#a855f7" strokeWidth="1" rx="4" />
            <text x="218" y="58" fill="#c084fc" fontSize="7" fontFamily="monospace" fontWeight="bold">
              ALPHAFOLD DE NOVO DOCKING
            </text>
            <text x="218" y="72" fill="#94a3b8" fontSize="7" fontFamily="monospace">
              RMSD: 0.78 Å | CONFIDENCE: 94.2%
            </text>

            <text x="35" y="34" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: GENERATIVE PROTEIN FOLDING & SYNTHETIC BIOLOGY
            </text>
          </svg>
        );
      }

      case 'ai':
      case 'code': {
        // Multi-agent neural graph node dispatch & streaming tokens
        const tokenWords = ['SPEC_VERIFY', 'SYNTHESIZE', 'ATTENTION_MAP', 'ALIGN_INVARIANT', 'DEPLOY_AGENT'];
        const activeWord = tokenWords[Math.floor(frame / 70) % tokenWords.length];
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#050a17" stroke="#1e293b" strokeWidth="2" rx="6" />

            {/* Neural Graph Nodes */}
            {[
              { id: 1, x: 80, y: 70, label: 'Prompt' },
              { id: 2, x: 170, y: 55, label: 'LLM Agent A' },
              { id: 3, x: 170, y: 125, label: 'Tool Refiner' },
              { id: 4, x: 265, y: 85, label: 'Formal Verifier' },
            ].map((node) => {
              const isPulse = (frame + node.id * 30) % 60 < 25;
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isPulse ? 18 : 15}
                    fill="#0f172a"
                    stroke={isPulse ? '#38bdf8' : '#334155'}
                    strokeWidth={isPulse ? 2 : 1}
                  />
                  <circle cx={node.x} cy={node.y} r="5" fill={isPulse ? '#38bdf8' : '#f97316'} />
                  <text x={node.x} y={node.y + 26} fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* Synaptic Connection Conduits */}
            <path
              d="M 95 70 Q 130 50 155 55"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <path
              d="M 95 70 Q 130 115 155 125"
              fill="none"
              stroke="#f97316"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <path
              d="M 185 55 Q 220 60 250 85"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <path
              d="M 185 125 Q 220 115 250 85"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
            />

            {/* Flowing Laser Signal Packets */}
            <circle
              cx={95 + ((frame * 3) % 65)}
              cy={70 - Math.sin((frame * 0.1) % 3) * 6}
              r="3.5"
              fill="#ffffff"
            />

            {/* Streaming Token Terminal Output Box */}
            <rect x="50" y="145" width="260" height="25" fill="#030712" stroke="#1f2937" rx="4" />
            <text x="60" y="161" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              &gt; EXEC_LOOP: {activeWord} [tokens: {(frame * 12) % 4096}/sec]
            </text>

            <text x="35" y="34" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              KINETIC ACTION: MULTI-AGENT REASONING & SPEC VERIFICATION
            </text>
          </svg>
        );
      }

      default: {
        // Universal Kinetic Oscillator
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full select-none">
            <rect x="20" y="20" width="320" height="160" fill="#090d18" stroke="#334155" strokeWidth="2" rx="6" />
            <circle cx="180" cy="100" r={40 + Math.sin(frame * 0.08) * 15} fill="none" stroke={primaryColor} strokeWidth="2" strokeDasharray="6 3" />
            <circle cx="180" cy="100" r="12" fill={primaryColor} />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4 + frame * 0.02;
              return (
                <line
                  key={i}
                  x1={180 + Math.cos(a) * 20}
                  y1={100 + Math.sin(a) * 20}
                  x2={180 + Math.cos(a) * 65}
                  y2={100 + Math.sin(a) * 65}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
              );
            })}
            <text x="180" y="165" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">
              KINETIC DEXTERITY SIMULATION ACTIVE
            </text>
          </svg>
        );
      }
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-[#060a14] shadow-inner relative flex flex-col">
      {/* Top Demonstrator Sub-Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            {viewMode === 'animation' ? 'Kinetic Motion (GIF) Simulation' : 'Historical Archival Plate'}
          </span>
          {viewMode === 'animation' && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-950/60 border border-sky-800/60 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>LIVE KINETICS</span>
            </span>
          )}
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('image')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === 'image'
                  ? 'bg-orange-950/80 text-orange-200 border border-orange-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show still photograph plate"
            >
              <ImageIcon className="w-3 h-3 text-orange-400" />
              <span>Still Image</span>
            </button>
            <button
              onClick={() => setViewMode('animation')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === 'animation'
                  ? 'bg-blue-950/80 text-blue-200 border border-blue-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show kinetic simulation GIF"
            >
              <Film className="w-3 h-3 text-blue-400" />
              <span>Kinetic (GIF)</span>
            </button>
          </div>

          {viewMode === 'animation' && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
              title={isPlaying ? 'Pause Animation' : 'Play Animation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Visual Frame (16:9 Aspect Ratio) */}
      <div className="relative w-full aspect-video bg-[#040812] flex items-center justify-center overflow-hidden">
        {viewMode === 'image' ? (
          <div className="relative w-full h-full group">
            <img
              src={resolvedImagePath}
              alt={`${skillName} demonstration`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="font-semibold text-white drop-shadow">Historical Archival Plate</span>
              <span className="text-orange-400 font-medium truncate max-w-[200px]">{skillName}</span>
            </div>
          </div>
        ) : (
          renderKineticSimulation()
        )}
      </div>
    </div>
  );
};
