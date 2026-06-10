// src/components/Pacman3D/index.js
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

const Pacman3D = () => {
    const mountRef = useRef(null);
    const pacmanRef = useRef(null);
    const ghostsRef = useRef([]);
    
    // React State for HUD
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameState, setGameState] = useState('PLAYING'); // 'PLAYING', 'GAME_OVER', 'VICTORY'

    // High performance refs for the Three.js loop
    const scoreRef = useRef(0);
    const livesRef = useRef(3);
    const gameStateRef = useRef('PLAYING');
    const isManualModeRef = useRef(false);
    const playerDirRef = useRef(new THREE.Vector3(1, 0, 0));
    const desiredDirRef = useRef(new THREE.Vector3(1, 0, 0));
    const isMovingRef = useRef(true);
    const restartTriggerRef = useRef(null);

    // 8-bit retro sound synthesizer using Web Audio API
    const playGameSound = useCallback((type) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            if (type === 'chomp') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(280, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.04, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                osc.start();
                osc.stop(ctx.currentTime + 0.08);
            } else if (type === 'die') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(160, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.45);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.45);
                osc.start();
                osc.stop(ctx.currentTime + 0.45);
            } else if (type === 'win') {
                const now = ctx.currentTime;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.6);
                
                osc.frequency.setValueAtTime(350, now);
                osc.frequency.setValueAtTime(440, now + 0.1);
                osc.frequency.setValueAtTime(520, now + 0.2);
                osc.frequency.setValueAtTime(700, now + 0.3);
                
                osc.start();
                osc.stop(now + 0.5);
            }
        } catch (e) {
            // Silently fallback if audio context is blocked by browser policies initially
        }
    }, []);

    const soundRef = useRef(playGameSound);
    useEffect(() => {
        soundRef.current = playGameSound;
    }, [playGameSound]);

    // Handle Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameStateRef.current !== 'PLAYING') return;
            
            let dirX = 0;
            let dirZ = 0;
            let validKey = false;
            
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                dirX = 1;
                validKey = true;
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                dirX = -1;
                validKey = true;
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                dirZ = 1;
                validKey = true;
            } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                dirZ = -1;
                validKey = true;
            }
            
            if (validKey) {
                isManualModeRef.current = true;
                isMovingRef.current = true;
                desiredDirRef.current.set(dirX, 0, dirZ);
                e.preventDefault(); // Prevent standard browser scroll
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!mountRef.current) return;

        // === Scene ===
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // === Camera ===
        const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.set(0, 24, 0); // Aerial perspective over layout
        camera.lookAt(0, -1, 0);

        // === Renderer ===
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        // === Lights ===
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        // Grid Ground (Matrix grid visualizer)
        const groundGeometry = new THREE.PlaneGeometry(30, 30, 20, 20);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x001100, wireframe: true });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        scene.add(ground);

        // === Maze Map ===
        const WALL_SIZE = 1;
        const MAZE_WIDTH = 21;
        const MAZE_HEIGHT = 19;
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x008f11, wireframe: true });
        const wallGeometry = new THREE.BoxGeometry(WALL_SIZE, WALL_SIZE * 1.2, WALL_SIZE);

        const maze = [
            '000000000000000000000',
            '011111111101111111110',
            '010001000101000100010',
            '011111111111111111110',
            '010001010000010100010',
            '011111011101110111110',
            '000001000101000100000',
            '111111011111110111111',
            '000001010000010100000',
            '011111110GGGo01111110', // Corral centre
            '000001010000010100000',
            '111111011111110111111',
            '000001010000010100000',
            '011111111101111111110',
            '010001000101000100010',
            '011101111111111101110',
            '000101010000010101000',
            '011111011101110111110',
            '000000000000000000000',
        ];

        const MAZE_OFFSET_X = -(MAZE_WIDTH * WALL_SIZE) / 2 + WALL_SIZE / 2;
        const MAZE_OFFSET_Z = -(MAZE_HEIGHT * WALL_SIZE) / 2 + WALL_SIZE / 2;

        const dotsGroup = new THREE.Group();
        scene.add(dotsGroup);

        const dots = [];
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x39ff14 });
        const dotGeometry = new THREE.SphereGeometry(0.12, 8, 8);

        // Build Walls and initial dots
        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                const char = maze[row][col];
                const x = col * WALL_SIZE + MAZE_OFFSET_X;
                const z = row * WALL_SIZE + MAZE_OFFSET_Z;

                if (char === '0') {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(x, WALL_SIZE * 0.6, z);
                    scene.add(wall);
                } else if (char === '1' || char === 'P' || char === 'o') {
                    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
                    dot.position.set(x, WALL_SIZE * 0.1, z);
                    dotsGroup.add(dot);
                    dots.push(dot);
                }
            }
        }

        // === Pac-Man ===
        const pacmanMaterial = new THREE.MeshBasicMaterial({ color: 0x39ff14, wireframe: true, side: THREE.DoubleSide });
        const pacmanGeometry = new THREE.SphereGeometry(WALL_SIZE * 0.4, 16, 16);
        const pacman = new THREE.Mesh(pacmanGeometry, pacmanMaterial);
        pacman.position.set(MAZE_OFFSET_X + WALL_SIZE * 1, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 1);
        scene.add(pacman);
        pacmanRef.current = pacman;

        // === Ghosts ===
        const ghostColors = [0x00ff41, 0x00ff8f, 0xffb000, 0xffffff];
        const ghostGeometry = new THREE.Group();
        const ghostBaseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff41, wireframe: true });
        
        // Ghost geometry wireframe (cylinder head + bottom round sphere dome)
        const ghostBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.7, 12), ghostBaseMaterial);
        ghostBody.position.y = 0.35;
        ghostGeometry.add(ghostBody);
        
        const ghostDome = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), ghostBaseMaterial);
        ghostDome.position.y = 0.7;
        ghostGeometry.add(ghostDome);

        // Ghost eyes
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ff41 });
        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
        eyeL.position.set(-0.16, 0.5, 0.28);
        const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
        eyeR.position.set(0.16, 0.5, 0.28);
        ghostGeometry.add(eyeL, eyeR);

        const initialGhostPositions = [
            new THREE.Vector3(MAZE_OFFSET_X + WALL_SIZE * 10, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 9),
            new THREE.Vector3(MAZE_OFFSET_X + WALL_SIZE * 9, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 9),
            new THREE.Vector3(MAZE_OFFSET_X + WALL_SIZE * 11, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 9),
            new THREE.Vector3(MAZE_OFFSET_X + WALL_SIZE * 10, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 8),
        ];

        const ghosts = [];
        ghostColors.forEach((color, index) => {
            const gGroup = ghostGeometry.clone();
            gGroup.traverse((child) => {
                if (child.isMesh && child.material === ghostBaseMaterial) {
                    child.material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
                }
            });
            gGroup.position.copy(initialGhostPositions[index]);
            scene.add(gGroup);
            ghosts.push({
                mesh: gGroup,
                direction: new THREE.Vector3(1, 0, 0),
                speed: 1.8, // units per second
                nextTurnTime: 0
            });
        });
        ghostsRef.current = ghosts;

        // Autoplay BFS Pathfinding
        const currentPath = [];
        const visited = new Set();
        const PACMAN_SPEED = 2.4; // grid units per second
        const MOUTH_SPEED = 6;
        let mouthOpen = true;
        let mouthAngle = 0.15;
        let lastUpdateTime = performance.now();

        const getGridPosition = (pos) => {
            const col = Math.round((pos.x - MAZE_OFFSET_X) / WALL_SIZE);
            const row = Math.round((pos.z - MAZE_OFFSET_Z) / WALL_SIZE);
            return { row, col };
        };

        const isWall = (row, col) => {
            if (row < 0 || row >= maze.length || col < 0 || col >= maze[0].length) {
                return true;
            }
            return maze[row][col] === '0';
        };

        const findNewPacmanPath = (startPos) => {
            currentPath.length = 0;
            visited.clear();

            const queue = [{ pos: startPos.clone(), path: [] }];
            const directions = [
                new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
            ];

            let pathFound = false;
            while (queue.length > 0 && !pathFound) {
                const { pos, path } = queue.shift();
                const { row, col } = getGridPosition(pos);
                const posKey = `${row},${col}`;

                if (visited.has(posKey)) continue;
                visited.add(posKey);

                if (path.length > 10) {
                    currentPath.push(...path);
                    pathFound = true;
                    break;
                }

                for (const dir of directions) {
                    const nextPos = pos.clone().add(dir.clone().multiplyScalar(WALL_SIZE));
                    const { row: nextRow, col: nextCol } = getGridPosition(nextPos);

                    if (!isWall(nextRow, nextCol) && !visited.has(`${nextRow},${nextCol}`)) {
                        queue.push({ pos: nextPos, path: [...path, dir] });
                    }
                }
            }
        };

        // Movement & Snapping logic
        const movePacman = (delta) => {
            if (!pacmanRef.current || gameStateRef.current !== 'PLAYING') return;

            // Mouth animated mesh recreation
            if (mouthOpen) {
                mouthAngle += MOUTH_SPEED * delta;
                if (mouthAngle > Math.PI * 0.35) mouthOpen = false;
            } else {
                mouthAngle -= MOUTH_SPEED * delta;
                if (mouthAngle < 0.05) mouthOpen = true;
            }
            pacmanRef.current.geometry.dispose();
            pacmanRef.current.geometry = new THREE.SphereGeometry(
                WALL_SIZE * 0.4, 
                16, 16, 
                mouthAngle, 
                Math.PI * 2 - (mouthAngle * 2), 
                0, Math.PI
            );
            pacmanRef.current.rotation.z = Math.PI / 2;

            if (!isManualModeRef.current) {
                // Autoplay BFS loop
                if (currentPath.length === 0) {
                    findNewPacmanPath(pacmanRef.current.position);
                }

                if (currentPath.length > 0) {
                    const nextDirection = currentPath[0];
                    const nextPosition = pacmanRef.current.position.clone().add(nextDirection.clone().multiplyScalar(PACMAN_SPEED * delta));
                    
                    const { row, col } = getGridPosition(nextPosition);
                    if (!isWall(row, col)) {
                        pacmanRef.current.position.copy(nextPosition);
                        // Rotate Pac-man
                        if (nextDirection.x > 0) pacmanRef.current.rotation.y = 0;
                        else if (nextDirection.x < 0) pacmanRef.current.rotation.y = Math.PI;
                        else if (nextDirection.z > 0) pacmanRef.current.rotation.y = Math.PI / 2;
                        else if (nextDirection.z < 0) pacmanRef.current.rotation.y = -Math.PI / 2;

                        const currentGridPos = getGridPosition(pacmanRef.current.position);
                        const targetX = currentGridPos.col * WALL_SIZE + MAZE_OFFSET_X;
                        const targetZ = currentGridPos.row * WALL_SIZE + MAZE_OFFSET_Z;

                        const arrivedAtCellCenter = (
                            Math.abs(pacmanRef.current.position.x - targetX) < PACMAN_SPEED * delta &&
                            Math.abs(pacmanRef.current.position.z - targetZ) < PACMAN_SPEED * delta
                        );
                        
                        if (arrivedAtCellCenter) {
                            pacmanRef.current.position.x = targetX;
                            pacmanRef.current.position.z = targetZ;
                            currentPath.shift();
                        }
                    } else {
                        currentPath.length = 0;
                    }
                }
            } else {
                // Interactive manual controls
                if (isMovingRef.current) {
                    const currentGridPos = getGridPosition(pacmanRef.current.position);
                    const targetX = currentGridPos.col * WALL_SIZE + MAZE_OFFSET_X;
                    const targetZ = currentGridPos.row * WALL_SIZE + MAZE_OFFSET_Z;

                    const distToCenter = Math.sqrt(
                        Math.pow(pacmanRef.current.position.x - targetX, 2) + 
                        Math.pow(pacmanRef.current.position.z - targetZ, 2)
                    );

                    const isAtCenter = distToCenter < PACMAN_SPEED * delta;

                    if (isAtCenter) {
                        pacmanRef.current.position.x = targetX;
                        pacmanRef.current.position.z = targetZ;

                        // Swap to desired turn direction if open
                        const desiredCol = currentGridPos.col + desiredDirRef.current.x;
                        const desiredRow = currentGridPos.row + desiredDirRef.current.z;

                        if (!isWall(desiredRow, desiredCol)) {
                            playerDirRef.current.copy(desiredDirRef.current);
                        }

                        // Check if moving forward hits wall
                        const nextCol = currentGridPos.col + playerDirRef.current.x;
                        const nextRow = currentGridPos.row + playerDirRef.current.z;

                        if (isWall(nextRow, nextCol)) {
                            isMovingRef.current = false;
                        }
                    }

                    if (isMovingRef.current) {
                        pacmanRef.current.position.add(playerDirRef.current.clone().multiplyScalar(PACMAN_SPEED * delta));
                        
                        const pDir = playerDirRef.current;
                        if (pDir.x > 0) pacmanRef.current.rotation.y = 0;
                        else if (pDir.x < 0) pacmanRef.current.rotation.y = Math.PI;
                        else if (pDir.z > 0) pacmanRef.current.rotation.y = Math.PI / 2;
                        else if (pDir.z < 0) pacmanRef.current.rotation.y = -Math.PI / 2;
                    }
                } else {
                    // Start moving if a valid key was selected
                    const currentGridPos = getGridPosition(pacmanRef.current.position);
                    const desiredCol = currentGridPos.col + desiredDirRef.current.x;
                    const desiredRow = currentGridPos.row + desiredDirRef.current.z;
                    if (!isWall(desiredRow, desiredCol)) {
                        playerDirRef.current.copy(desiredDirRef.current);
                        isMovingRef.current = true;
                    }
                }
            }
        };

        // Ghost random movement loop
        const moveGhosts = (delta, time) => {
            ghostsRef.current.forEach(ghost => {
                if (time > ghost.nextTurnTime) {
                    const { row, col } = getGridPosition(ghost.mesh.position);
                    const possibleDirections = [];
                    const directions = [
                        new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
                        new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
                    ];

                    for (const dir of directions) {
                        const nextGridCol = col + dir.x;
                        const nextGridRow = row + dir.z;
                        if (!isWall(nextGridRow, nextGridCol)) {
                            possibleDirections.push(dir);
                        }
                    }

                    if (possibleDirections.length > 0) {
                        const oppositeDir = ghost.direction.clone().negate();
                        const validTurns = possibleDirections.filter(d => !d.equals(oppositeDir));
                        
                        if (validTurns.length > 0) {
                            ghost.direction = validTurns[Math.floor(Math.random() * validTurns.length)];
                        } else {
                            ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                        }
                    }
                    ghost.nextTurnTime = time + (Math.random() * 1800 + 700);
                }

                const nextPosition = ghost.mesh.position.clone().add(ghost.direction.clone().multiplyScalar(ghost.speed * delta));
                const { row: nextRow, col: nextCol } = getGridPosition(nextPosition);

                if (!isWall(nextRow, nextCol)) {
                    ghost.mesh.position.copy(nextPosition);
                    // Orient ghost
                    if (ghost.direction.x > 0) ghost.mesh.rotation.y = -Math.PI / 2;
                    else if (ghost.direction.x < 0) ghost.mesh.rotation.y = Math.PI / 2;
                    else if (ghost.direction.z > 0) ghost.mesh.rotation.y = 0;
                    else if (ghost.direction.z < 0) ghost.mesh.rotation.y = Math.PI;
                } else {
                    ghost.nextTurnTime = 0;
                }
            });
        };

        // Collisions Engine
        const checkCollisions = () => {
            if (gameStateRef.current !== 'PLAYING') return;

            // 1. Eat Dots
            for (let i = dots.length - 1; i >= 0; i--) {
                const dot = dots[i];
                const dist = pacmanRef.current.position.distanceTo(dot.position);
                if (dist < 0.45) {
                    dotsGroup.remove(dot);
                    dots.splice(i, 1);
                    
                    scoreRef.current += 10;
                    setScore(scoreRef.current);
                    soundRef.current('chomp');

                    // Scale bounce effect
                    pacmanRef.current.scale.set(1.4, 1.4, 1.4);
                    setTimeout(() => {
                        if (pacmanRef.current) {
                            pacmanRef.current.scale.set(1, 1, 1);
                        }
                    }, 80);
                    break;
                }
            }

            // 2. Victory Check
            if (dots.length === 0) {
                gameStateRef.current = 'VICTORY';
                setGameState('VICTORY');
                soundRef.current('win');
                return;
            }

            // 3. Ghost Hit
            for (const ghost of ghostsRef.current) {
                const dist = pacmanRef.current.position.distanceTo(ghost.mesh.position);
                if (dist < 0.5) {
                    soundRef.current('die');
                    livesRef.current -= 1;
                    setLives(livesRef.current);

                    if (livesRef.current <= 0) {
                        gameStateRef.current = 'GAME_OVER';
                        setGameState('GAME_OVER');
                    } else {
                        // Reset Position on death
                        pacmanRef.current.position.set(MAZE_OFFSET_X + WALL_SIZE * 1, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 1);
                        currentPath.length = 0;
                        isMovingRef.current = true;
                        playerDirRef.current.set(1, 0, 0);
                        desiredDirRef.current.set(1, 0, 0);

                        ghostsRef.current.forEach((g, index) => {
                            g.mesh.position.copy(initialGhostPositions[index]);
                            g.direction.set(1, 0, 0);
                            g.nextTurnTime = 0;
                        });
                    }
                    break;
                }
            }
        };

        // Animation Request Loop
        let frameId;
        const animate = (time) => {
            frameId = requestAnimationFrame(animate);

            const delta = Math.min((time - lastUpdateTime) / 1000, 0.1); // cap delta to avoid massive leaps
            lastUpdateTime = time;

            movePacman(delta);
            moveGhosts(delta, time);
            checkCollisions();

            renderer.render(scene, camera);
        };
        animate(performance.now());

        // Restart Handler Setup
        restartTriggerRef.current = () => {
            scoreRef.current = 0;
            livesRef.current = 3;
            gameStateRef.current = 'PLAYING';
            isManualModeRef.current = false;
            isMovingRef.current = true;
            playerDirRef.current.set(1, 0, 0);
            desiredDirRef.current.set(1, 0, 0);
            currentPath.length = 0;

            setScore(0);
            setLives(3);
            setGameState('PLAYING');

            pacman.position.set(MAZE_OFFSET_X + WALL_SIZE * 1, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 1);
            pacman.scale.set(1, 1, 1);

            ghosts.forEach((g, index) => {
                g.mesh.position.copy(initialGhostPositions[index]);
                g.direction.set(1, 0, 0);
                g.nextTurnTime = 0;
            });

            // Rebuild dot nodes
            while(dotsGroup.children.length > 0){
                dotsGroup.remove(dotsGroup.children[0]);
            }
            dots.length = 0;

            for (let row = 0; row < maze.length; row++) {
                for (let col = 0; col < maze[row].length; col++) {
                    const char = maze[row][col];
                    const x = col * WALL_SIZE + MAZE_OFFSET_X;
                    const z = row * WALL_SIZE + MAZE_OFFSET_Z;

                    if (char === '1' || char === 'P' || char === 'o') {
                        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
                        dot.position.set(x, WALL_SIZE * 0.1, z);
                        dotsGroup.add(dot);
                        dots.push(dot);
                    }
                }
            }
        };

        // Resize callback
        const onWindowResize = () => {
            if (mountRef.current) {
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            }
        };
        window.addEventListener('resize', onWindowResize);

        const currentMount = mountRef.current;

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', onWindowResize);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            scene.traverse(obj => {
                if (obj.isMesh) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(material => material.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
            renderer.dispose();
        };
    }, []);

    const handleRestart = () => {
        if (restartTriggerRef.current) {
            restartTriggerRef.current();
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', margin: '12px 0' }}>
            {/* 3D Canvas Mount */}
            <div ref={mountRef} style={{ width: '100%', height: '420px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #00ff41' }}></div>
            
            {/* HUD Status line overlay */}
            <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: "'Share Tech Mono', 'Fira Code', monospace",
                fontSize: '0.95em',
                color: '#00ff41',
                textShadow: '0 0 5px #00ff41',
                pointerEvents: 'none',
                fontWeight: 'bold'
            }}>
                <div>SCORE: {score}</div>
                <div>LIVES: {'❤ '.repeat(lives)}</div>
            </div>

            {/* Instruction bar */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                textAlign: 'center',
                fontFamily: "'Share Tech Mono', 'Fira Code', monospace",
                fontSize: '0.75em',
                color: '#ffb000',
                textShadow: '0 0 4px #ffb000',
                pointerEvents: 'none',
                letterSpacing: '1px'
            }}>
                {gameState === 'PLAYING' && (
                    <span>[ USE ARROWS OR WASD TO DRIVE PACMAN (STARTS IN AUTOPLAY DEMO) ]</span>
                )}
            </div>

            {/* Defeat / Victory Popup */}
            {gameState !== 'PLAYING' && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(2, 6, 3, 0.88)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    border: '1px solid ' + (gameState === 'VICTORY' ? '#00ff41' : '#ff3333'),
                    boxShadow: 'inset 0 0 30px rgba(0, 255, 65, 0.1)'
                }}>
                    <h2 style={{
                        color: gameState === 'VICTORY' ? '#00ff41' : '#ff3333',
                        textShadow: gameState === 'VICTORY' ? '0 0 15px #00ff41' : '0 0 15px #ff3333',
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '1.6em',
                        marginBottom: '20px',
                        letterSpacing: '2px'
                    }}>
                        {gameState === 'VICTORY' ? 'SYSTEM SECURED: VICTORY' : 'CORE CRASH: GAME OVER'}
                    </h2>
                    
                    <button
                        onClick={handleRestart}
                        style={{
                            background: 'transparent',
                            border: '1px solid ' + (gameState === 'VICTORY' ? '#00ff41' : '#ff3333'),
                            color: gameState === 'VICTORY' ? '#00ff41' : '#ff3333',
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: '1em',
                            padding: '8px 20px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px ' + (gameState === 'VICTORY' ? 'rgba(0,255,65,0.2)' : 'rgba(255,51,51,0.2)'),
                            transition: 'all 0.2s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = gameState === 'VICTORY' ? '#00ff41' : '#ff3333';
                            e.target.style.color = '#020603';
                            e.target.style.boxShadow = '0 0 15px ' + (gameState === 'VICTORY' ? '#00ff41' : '#ff3333');
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = gameState === 'VICTORY' ? '#00ff41' : '#ff3333';
                            e.target.style.boxShadow = '0 0 10px ' + (gameState === 'VICTORY' ? 'rgba(0,255,65,0.2)' : 'rgba(255,51,51,0.2)');
                        }}
                    >
                        REBOOT EMULATOR
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pacman3D;