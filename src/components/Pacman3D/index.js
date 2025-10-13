// src/components/Pacman3D/index.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Pacman3D = () => {
    const mountRef = useRef(null);
    const pacmanRef = useRef(null); // Ref para o Pac-Man para controlar a boca
    const ghostsRef = useRef([]); // Ref para os fantasmas

    useEffect(() => {
        if (!mountRef.current) return;

        // === Scene ===
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        // === Camera ===
        // Visão mais de cima, para simular o jogo
        const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.set(0, 30, 0); // Posição de cima
        camera.lookAt(0, 0, 0); // Olhando para o centro do labirinto

        // === Renderer ===
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);
        renderer.shadowMap.enabled = true; // Habilita sombras para um visual mais real
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // === Lights ===
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true; // Esta luz vai gerar sombras
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        scene.add(directionalLight);

        // Chão para as sombras
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x111122 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        scene.add(ground);

        // === Labirinto ===
        const WALL_SIZE = 1;
        const MAZE_WIDTH = 21;
        const MAZE_HEIGHT = 21;
        const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x0000aa }); // Azul escuro
        const wallGeometry = new THREE.BoxGeometry(WALL_SIZE, WALL_SIZE * 1.5, WALL_SIZE); // Paredes mais altas

        // Representação do labirinto (simplificado, mas mais complexo que antes)
        // 0 = parede, 1 = caminho, 2 = dot, 3 = power dot, P = Pac-Man, G = Fantasma
        const maze = [
            '000000000000000000000',
            '0PPPPPPPPPPGPPPPPPPPP0', // Posição inicial Pac-Man e Fantasma
            '000000000000000000000',
            '011111111111111111110',
            '010000000000000000010',
            '010111111111111111010',
            '010100000000000001010',
            '01010111111111101010',
            '0101010000000101010',
            '0101010111010101010',
            '010101000G000101010',
            '0101010111010101010',
            '0101010000000101010',
            '01010111111111101010',
            '010100000000000001010',
            '010111111111111111010',
            '010000000000000000010',
            '011111111111111111110',
            '000000000000000000000',
        ];

        const MAZE_OFFSET_X = -(MAZE_WIDTH * WALL_SIZE) / 2 + WALL_SIZE / 2;
        const MAZE_OFFSET_Z = -(MAZE_HEIGHT * WALL_SIZE) / 2 + WALL_SIZE / 2;

        const dots = []; // Array para as pastilhas
        const dotMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee }); // Branco
        const dotGeometry = new THREE.SphereGeometry(0.1, 16, 16);

        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                const char = maze[row][col];
                const x = col * WALL_SIZE + MAZE_OFFSET_X;
                const z = row * WALL_SIZE + MAZE_OFFSET_Z;

                if (char === '0') {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(x, WALL_SIZE * 0.75, z);
                    wall.castShadow = true;
                    wall.receiveShadow = true;
                    scene.add(wall);
                } else if (char === '1' || char === 'P' || char === 'G') {
                    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
                    dot.position.set(x, WALL_SIZE * 0.1, z);
                    scene.add(dot);
                    dots.push(dot);
                }
            }
        }

        // === Pac-Man ===
        const pacmanMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, side: THREE.DoubleSide }); // Amarelo, DoubleSide para a boca
        const pacmanGeometry = new THREE.SphereGeometry(WALL_SIZE * 0.4, 32, 32);
        const pacman = new THREE.Mesh(pacmanGeometry, pacmanMaterial);
        pacman.position.set(MAZE_OFFSET_X + WALL_SIZE * 1, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 1); // Posição inicial
        pacman.castShadow = true;
        scene.add(pacman);
        pacmanRef.current = pacman;

        // Boca do Pac-Man (um cone para simular a abertura)
        const mouthGeometry = new THREE.ConeGeometry(WALL_SIZE * 0.4, WALL_SIZE * 0.4, 32);
        const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a2e }); // Cor do fundo para "cortar"
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(WALL_SIZE * 0.2, 0, 0); // Posição relativa ao Pac-Man
        mouth.rotation.y = -Math.PI / 2; // Aponta para fora
        pacman.add(mouth); // Adiciona a boca como filho do Pac-Man

        // === Fantasmas ===
        const ghostColors = [0xff0000, 0x00ffff, 0xffb8de, 0xffb847]; // Vermelho, Ciano, Rosa, Laranja
        const ghostMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const ghostGeometry = new THREE.Group(); // Grupo para o corpo e olhos
        
        // Corpo do fantasma (cápsula invertida)
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32), ghostMaterial);
        body.position.y = 0.4; // Altura do corpo
        ghostGeometry.add(body);
        
        const bottom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI), ghostMaterial);
        bottom.position.y = 0; // Parte de baixo arredondada
        ghostGeometry.add(bottom);

        // Olhos (esferas brancas e pupilas azuis)
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const pupilGeometry = new THREE.SphereGeometry(0.08, 16, 16);

        const eyeMaterialWhite = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const eyeMaterialBlue = new THREE.MeshPhongMaterial({ color: 0x0000ff });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterialWhite);
        leftEye.position.set(-0.2, 0.7, 0.3);
        const leftPupil = new THREE.Mesh(pupilGeometry, eyeMaterialBlue);
        leftPupil.position.set(-0.2, 0.7, 0.4); // Pouco a frente do olho
        ghostGeometry.add(leftEye, leftPupil);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterialWhite);
        rightEye.position.set(0.2, 0.7, 0.3);
        const rightPupil = new THREE.Mesh(pupilGeometry, eyeMaterialBlue);
        rightPupil.position.set(0.2, 0.7, 0.4);
        ghostGeometry.add(rightEye, rightPupil);


        const initialGhostPositions = [
            new THREE.Vector3(MAZE_OFFSET_X + WALL_SIZE * 10, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 10), // Centro do "corral"
            new THREE.Vector3(MAZE_OFFSET_X + WALL_SIZE * 9, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 10),
            new THREE.Vector3(MAZE_OFFSET_X + WALL_SIZE * 11, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 10),
            new THREE.Vector3(MAZE_OFFSET_X + WALL_SIZE * 10, WALL_SIZE * 0.25, MAZE_OFFSET_Z + WALL_SIZE * 9),
        ];

        const ghosts = [];
        ghostColors.forEach((color, index) => {
            const ghostGroup = ghostGeometry.clone(); // Clona o grupo de geometria
            ghostGroup.traverse((child) => {
                if (child.isMesh && child.material === ghostMaterial) {
                    child.material = new THREE.MeshPhongMaterial({ color: color }); // Aplica a cor individual
                }
            });
            ghostGroup.position.copy(initialGhostPositions[index]);
            ghostGroup.castShadow = true;
            ghostGroup.receiveShadow = true;
            scene.add(ghostGroup);
            ghosts.push({
                mesh: ghostGroup,
                direction: new THREE.Vector3(1, 0, 0), // Direção inicial arbitrária
                speed: 0.05,
                nextTurnTime: 0 // Tempo para a próxima mudança de direção
            });
        });
        ghostsRef.current = ghosts;


        // === Lógica de Movimento e Jogo (Simplificada) ===
        const currentPath = [];
        const visited = new Set();
        const PACMAN_SPEED = 0.08;
        let pacmanDirection = new THREE.Vector3(1, 0, 0); // Começa indo para a direita
        let mouthOpen = true;
        let mouthAngle = 0;
        const MOUTH_SPEED = 0.1; // Velocidade da boca
        let lastUpdateTime = performance.now();

        // Helper para converter posição 3D para grid do labirinto
        const getGridPosition = (pos) => {
            const col = Math.round((pos.x - MAZE_OFFSET_X) / WALL_SIZE);
            const row = Math.round((pos.z - MAZE_OFFSET_Z) / WALL_SIZE);
            return { row, col };
        };

        // Helper para verificar se a posição é uma parede
        const isWall = (row, col) => {
            if (row < 0 || row >= maze.length || col < 0 || col >= maze[0].length) {
                return true; // Fora dos limites é parede
            }
            return maze[row][col] === '0';
        };

        // Função para encontrar um novo caminho aleatório para Pac-Man (BFS simplificado ou random walk)
        const findNewPacmanPath = (startPos) => {
            currentPath.length = 0; // Limpa o caminho atual
            visited.clear();

            const queue = [{ pos: startPos, path: [] }];
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

                if (path.length > 10) { // Limita o comprimento do caminho para evitar travamentos
                    currentPath.push(...path);
                    pathFound = true;
                    break;
                }

                for (const dir of directions) {
                    const nextPos = pos.clone().add(dir.clone().multiplyScalar(WALL_SIZE));
                    const { row: nextRow, col: nextCol } = getGridPosition(nextPos);

                    if (!isWall(nextRow, nextCol) && !visited.has(`${nextRow},${nextCol}`)) {
                        const newPath = [...path, dir];
                        queue.push({ pos: nextPos, path: newPath });
                    }
                }
            }
            // eslint-disable-next-line no-undef
            if (!pathFound && path.length > 0) { // Se não encontrou um caminho longo, usa o que tem
                // eslint-disable-next-line no-undef
                currentPath.push(...path);
            }
        };


        // Movimento do Pac-Man
        const movePacman = (delta) => {
            if (!pacmanRef.current) return;

            // Animação da boca
            if (mouthOpen) {
                mouthAngle += MOUTH_SPEED * delta;
                if (mouthAngle > Math.PI * 0.8) { // Abre até um certo ângulo
                    mouthOpen = false;
                }
            } else {
                mouthAngle -= MOUTH_SPEED * delta;
                if (mouthAngle < 0) { // Fecha completamente
                    mouthOpen = true;
                }
            }
            pacmanRef.current.geometry = new THREE.SphereGeometry(WALL_SIZE * 0.4, 32, 32, mouthAngle, Math.PI * 2 - (mouthAngle * 2), 0, Math.PI * 0.8);
            pacmanRef.current.rotation.z = Math.PI / 2; // Mantém a boca alinhada

            // Movimento automático
            if (currentPath.length === 0) {
                findNewPacmanPath(pacmanRef.current.position);
            }

            if (currentPath.length > 0) {
                const nextDirection = currentPath[0];
                const nextPosition = pacmanRef.current.position.clone().add(nextDirection.clone().multiplyScalar(PACMAN_SPEED * delta));
                
                const { row, col } = getGridPosition(nextPosition);
                if (!isWall(row, col)) {
                    pacmanRef.current.position.copy(nextPosition);
                    // Orientar o Pac-Man na direção do movimento
                    if (nextDirection.x > 0) pacmanRef.current.rotation.y = 0; // Direita
                    else if (nextDirection.x < 0) pacmanRef.current.rotation.y = Math.PI; // Esquerda
                    else if (nextDirection.z > 0) pacmanRef.current.rotation.y = Math.PI / 2; // Baixo
                    else if (nextDirection.z < 0) pacmanRef.current.rotation.y = -Math.PI / 2; // Cima

                    // Verificar se chegou ao centro de uma célula, para mudar de direção
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
                        currentPath.shift(); // Remove a direção atual do caminho
                    }
                } else {
                    currentPath.length = 0; // Parou em uma parede, recalcula
                }
            }
        };

        // Movimento dos Fantasmas (random walk)
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
                        // Evita virar 180 graus imediatamente, a menos que seja a única opção
                        const oppositeDir = ghost.direction.clone().negate();
                        const validTurns = possibleDirections.filter(d => !d.equals(oppositeDir));
                        
                        if (validTurns.length > 0) {
                            ghost.direction = validTurns[Math.floor(Math.random() * validTurns.length)];
                        } else { // Se só pode virar 180, vira
                            ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                        }
                    }
                    ghost.nextTurnTime = time + (Math.random() * 2000 + 1000); // Muda de direção a cada 1-3 segundos
                }

                const nextPosition = ghost.mesh.position.clone().add(ghost.direction.clone().multiplyScalar(ghost.speed * delta));
                const { row: nextRow, col: nextCol } = getGridPosition(nextPosition);

                if (!isWall(nextRow, nextCol)) {
                    ghost.mesh.position.copy(nextPosition);
                    // Orientar o fantasma na direção do movimento
                    if (ghost.direction.x > 0) ghost.mesh.rotation.y = -Math.PI / 2; // Direita
                    else if (ghost.direction.x < 0) ghost.mesh.rotation.y = Math.PI / 2; // Esquerda
                    else if (ghost.direction.z > 0) ghost.mesh.rotation.y = 0; // Baixo
                    else if (ghost.direction.z < 0) ghost.mesh.rotation.y = Math.PI; // Cima
                } else {
                    // Se bateu em uma parede, recalcula a direção imediatamente
                    ghost.nextTurnTime = 0;
                }
            });
        };


        // === Animate Loop ===
        const animate = (time) => {
            requestAnimationFrame(animate);

            const delta = (time - lastUpdateTime) / 1000; // Tempo em segundos desde a última atualização
            lastUpdateTime = time;

            movePacman(delta);
            moveGhosts(delta, time); // Passa o tempo para controlar a mudança de direção

            renderer.render(scene, camera);
        };
        animate(performance.now());


        // === Window Resize ===
        const onWindowResize = () => {
            if (mountRef.current) {
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            }
        };
        window.addEventListener('resize', onWindowResize);

        // === Cleanup ===
        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
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
            // Sem OrbitControls, não precisa de controls.dispose()
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return <div ref={mountRef} style={{ width: '100%', height: '500px', margin: '20px 0', borderRadius: '8px', overflow: 'hidden' }}></div>;
};

export default Pacman3D;