class ObjectDetector {
    constructor() {
        this.video = document.getElementById('webcam');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.model = null;
        this.stream = null;
        this.tracks = new Map();
        this.nextId = 1;
        this.lastTime = 0;
        this.fps = 0;
        
        // COCO CLASS TO HIGH-QUALITY OBJECT IMAGES
        this.objectImages = {
            'person': 'https://images.unsplash.com/photo-1518627019693-e45ce3e3d3c1?w=100&h=100&fit=crop',
            'bicycle': 'https://images.unsplash.com/photo-1488554105600-4c7226f7e9f4?w=100&h=100&fit=crop',
            'car': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100&h=100&fit=crop',
            'motorcycle': 'https://images.unsplash.com/photo-1502877338535-766e1452684b?w=100&h=100&fit=crop',
            'airplane': 'https://images.unsplash.com/photo-1501768234468-6b0cbaaee71c?w=100&h=100&fit=crop',
            'bus': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop',
            'train': 'https://images.unsplash.com/photo-1514118625418-cd49f42ee838?w=100&h=100&fit=crop',
            'truck': 'https://images.unsplash.com/photo-1563726284950-9f88e757db0e?w=100&h=100&fit=crop',
            'boat': 'https://images.unsplash.com/photo-1562640922-5d2ab4496984?w=100&h=100&fit=crop',
            'traffic light': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100&h=100&fit=crop',
            'fire hydrant': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop',
            'stop sign': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100&h=100&fit=crop',
            'parking meter': 'https://images.unsplash.com/photo-1564487116677-08b1c5ab7498?w=100&h=100&fit=crop',
            'bench': 'https://images.unsplash.com/photo-1588080320036-5e64c2735768?w=100&h=100&fit=crop',
            'bird': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop',
            'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop',
            'dog': 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=100&h=100&fit=crop',
            'horse': 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=100&h=100&fit=crop',
            'sheep': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=100&h=100&fit=crop',
            'cow': 'https://images.unsplash.com/photo-1507106394574-5d78b4a8b3f1?w=100&h=100&fit=crop',
            'elephant': 'https://images.unsplash.com/photo-1577043088561-90d415445b81?w=100&h=100&fit=crop',
            'bear': 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=100&h=100&fit=crop',
            'zebra': 'https://images.unsplash.com/photo-1534450292626-b96a28cf4e1f?w=100&h=100&fit=crop',
            'giraffe': 'https://images.unsplash.com/photo-1583337134166-9e69f6d67856?w=100&h=100&fit=crop',
            'backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
            'umbrella': 'https://images.unsplash.com/photo-1534450292626-b96a28cf4e1f?w=100&h=100&fit=crop',
            'handbag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
            'tie': 'https://images.unsplash.com/photo-1591370879151-ce87c3b6e9f2?w=100&h=100&fit=crop',
            'suitcase': 'https://images.unsplash.com/photo-1542393545-12a5db523a5f?w=100&h=100&fit=crop',
            'frisbee': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
            'skis': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop',
            'snowboard': 'https://images.unsplash.com/photo-1517413518527-756f28a61e5e?w=100&h=100&fit=crop',
            'sports ball': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
            'kite': 'https://images.unsplash.com/photo-1559526390-42f46019a6b9?w=100&h=100&fit=crop',
            'baseball bat': 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c59?w=100&h=100&fit=crop',
            'baseball glove': 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c59?w=100&h=100&fit=crop',
            'skateboard': 'https://images.unsplash.com/photo-1558618047-3c8c76fdd4e4?w=100&h=100&fit=crop',
            'surfboard': 'https://images.unsplash.com/photo-1524594152306-1b23f4812de4?w=100&h=100&fit=crop',
            'tennis racket': 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c59?w=100&h=100&fit=crop',
            'bottle': 'https://images.unsplash.com/photo-1610877923950-cb742683df4d?w=100&h=100&fit=crop',
            'cup': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop',
            'fork': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
            'knife': 'https://images.unsplash.com/photo-1586502358767-606245e30eee?w=100&h=100&fit=crop',
            'spoon': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
            'bowl': 'https://images.unsplash.com/photo-1561978306-c5e3f17ab0a9?w=100&h=100&fit=crop',
            'banana': 'https://images.unsplash.com/photo-1567306271407-7f743aea9c08?w=100&h=100&fit=crop',
            'apple': 'https://images.unsplash.com/photo-1567954236586-433c5a1f395e?w=100&h=100&fit=crop',
            'sandwich': 'https://images.unsplash.com/photo-1555939594-58056f625634?w=100&h=100&fit=crop',
            'orange': 'https://images.unsplash.com/photo-1579613832121-def708b3aa66?w=100&h=100&fit=crop',
            'broccoli': 'https://images.unsplash.com/photo-1546833999-10d3ce50378e?w=100&h=100&fit=crop',
            'carrot': 'https://images.unsplash.com/photo-1577612486782-990b9e03641e?w=100&h=100&fit=crop',
            'hot dog': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
            'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
            'donut': 'https://images.unsplash.com/photo-1543352639-37f9a42d5bd7?w=100&h=100&fit=crop',
            'cake': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop'
        };
        
        this.init();
        this.setupBackground();
    }

    async init() {
        try {
            this.model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
            document.getElementById('modelStatus').textContent = 'Model: Ready (COCO-SSD)';
            console.log('✅ Model loaded successfully - 80+ object classes');
        } catch (error) {
            console.error('❌ Model load failed:', error);
            document.getElementById('modelStatus').textContent = 'Model: Failed to load';
        }
        
        this.setupEventListeners();
        this.resizeCanvas();
    }

    setupEventListeners() {
        document.getElementById('startBtn').onclick = () => this.startCamera();
        document.getElementById('stopBtn').onclick = () => this.stopCamera();
        document.getElementById('clearTracks').onclick = () => this.clearTracks();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    setupBackground() {
        document.addEventListener('mousemove', (e) => {
            document.body.style.setProperty('--mouse-x', e.clientX + 'px');
            document.body.style.setProperty('--mouse-y', e.clientY + 'px');
            document.body.classList.add('mouse-moving');
            clearTimeout(window.mouseTimeout);
            window.mouseTimeout = setTimeout(() => {
                document.body.classList.remove('mouse-moving');
            }, 2000);
        });

        this.createParticles();
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            this.video.srcObject = this.stream;
            
            this.video.onloadedmetadata = () => {
                this.video.play();
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.detectLoop();
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
                document.querySelector('.no-detection').style.display = 'none';
            };
        } catch (error) {
            console.error('Camera access failed:', error);
            alert('Camera access denied. Please allow camera permission.');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.getElementById('detections').innerHTML = '<div class="no-detection">Camera stopped. Click Start to continue...</div>';
    }

    clearTracks() {
        this.tracks.clear();
        this.nextId = 1;
        document.getElementById('objectsCount').textContent = `Objects: 0`;
        this.updateDetectionsUI();
    }

    resizeCanvas() {
        const videoRect = this.video.getBoundingClientRect();
        this.canvas.width = videoRect.width;
        this.canvas.height = videoRect.height;
    }

    async detectLoop(currentTime = 0) {
        if (!this.model || !this.video.videoWidth) {
            requestAnimationFrame((time) => this.detectLoop(time));
            return;
        }

        if (currentTime) {
            this.fps = Math.round(1000 / (currentTime - this.lastTime));
            this.lastTime = currentTime;
            document.getElementById('fps').textContent = `FPS: ${this.fps}`;
        }

        try {
            const predictions = await this.model.detect(this.video, 0.5, 0.5);
            this.updateTracks(predictions);
            this.render(predictions);
            this.updateDetectionsUI();
        } catch (error) {
            console.error('Detection error:', error);
        }

        requestAnimationFrame((time) => this.detectLoop(time));
    }

    updateTracks(predictions) {
        const currentTracks = new Map();
        
        predictions.forEach(pred => {
            const bbox = pred.bbox;
            const centerX = bbox[0] + bbox[2] / 2;
            const centerY = bbox[1] + bbox[3] / 2;
            
            let matchedTrack = null;
            let bestDistance = Infinity;
            
            for (let [trackId, track] of this.tracks) {
                const distance = Math.hypot(centerX - track.centerX, centerY - track.centerY);
                if (distance < 100 && distance < bestDistance && track.className === pred.class) {
                    matchedTrack = track;
                    bestDistance = distance;
                }
            }
            
            if (matchedTrack) {
                matchedTrack.centerX = centerX;
                matchedTrack.centerY = centerY;
                matchedTrack.bbox = bbox;
                matchedTrack.score = pred.score;
                matchedTrack.age++;
                currentTracks.set(matchedTrack.id, matchedTrack);
            } else {
                const newTrack = {
                    id: this.nextId++,
                    className: pred.class,
                    bbox,
                    centerX,
                    centerY,
                    score: pred.score,
                    age: 1
                };
                currentTracks.set(newTrack.id, newTrack);
            }
        });
        
        this.tracks = currentTracks;
        document.getElementById('objectsCount').textContent = `Objects: ${this.tracks.size}`;
    }

    render(predictions) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let [, track] of this.tracks) {
            const bbox = track.bbox;
            const x = (bbox[0] / 640) * this.canvas.width;
            const y = (bbox[1] / 480) * this.canvas.height;
            const w = (bbox[2] / 640) * this.canvas.width;
            const h = (bbox[3] / 480) * this.canvas.height;

            // Dynamic color based on track age
            this.ctx.strokeStyle = `hsl(${(track.age * 15) % 360}, 100%, 50%)`;
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(x, y, w, h);

            // Label background
            this.ctx.fillStyle = `rgba(0, 0, 0, 0.8)`;
            this.ctx.fillRect(x, y - 30, Math.min(250, w), 30);

            // Label text
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Orbitron, Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(
                `${track.className} ${Math.round(track.score * 100)}% ID:${track.id}`, 
                x + 8, y - 8
            );
        }
    }

    updateDetectionsUI() {
        const recentDetections = Array.from(this.tracks.values())
            .sort((a, b) => b.age - a.age)
            .slice(0, 8)
            .map(track => ({
                className: track.className,
                score: track.score,
                id: track.id,
                age: track.age
            }));

        document.getElementById('detections').innerHTML = recentDetections
            .map(d => `
                <div class="detection-item">
                    <img src="${this.objectImages[d.className] || 'https://images.unsplash.com/photo-1606166453340-077d4b722e51?w=100&h=100&fit=crop'}" 
                         alt="${d.className}" class="object-image" 
                         onerror="this.src='https://images.unsplash.com/photo-1606166453340-077d4b722e51?w=100&h=100&fit=crop'">
                    <div class="object-info">
                        <div class="object-name">${d.className.toUpperCase()}</div>
                        <div class="object-details">
                            <span class="confidence-badge">${Math.round(d.score*100)}%</span>
                            <span class="track-id">ID: ${d.id}</span>
                            <span style="color: var(--text-muted);">(${d.age}s)</span>
                        </div>
                    </div>
                </div>
            `).join('') || '<div class="no-detection">No objects detected yet...</div>';
    }
}

// Initialize when page loads
window.addEventListener('load', () => new ObjectDetector());
