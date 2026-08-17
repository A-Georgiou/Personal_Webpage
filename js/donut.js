(function () {
    'use strict';

    // Torus geometry, mirroring donut.py
    var R1 = 1;   // circle_radius: radius of the tube
    var R2 = 2;   // edge_distance: origin to the centre of the tube
    var K2 = 5;   // z_distance: viewer to the centre of the torus

    var THETA_STEPS = 120;  // samples around the tube
    var PHI_STEPS = 340;    // sweeps around the y axis
    var LUMINANCE = '.,-~:;=!*#$@';
    var FILL = 0.72;        // share of the shorter screen axis the donut spans

    // Largest |x/z| (and |y/z|) reached by the lit surface, over every rotation.
    // Perspective magnifies the near face, so the scale is derived from this
    // rather than the torus radius, otherwise the donut overflows the frame.
    var MAX_PROJ = 0.75;

    var ROT_A = 0.5;        // radians per second, x axis
    var ROT_B = 0.3;        // radians per second, z axis
    var FRAME_MS = 1000 / 30;

    // Builds a renderer bound to a character grid. All trigonometry that does
    // not depend on the frame is computed once, and every frame reuses the same
    // typed arrays so the animation allocates nothing while running.
    function createRenderer(cols, rows, cellAspect) {
        var size = cols * rows;
        var zbuf = new Float32Array(size);
        var out = new Uint8Array(size);
        var rowCodes = new Uint16Array(cols);
        var lines = new Array(rows);

        var codes = new Uint16Array(LUMINANCE.length);
        for (var c = 0; c < LUMINANCE.length; c++) {
            codes[c] = LUMINANCE.charCodeAt(c);
        }

        var cosT = new Float32Array(THETA_STEPS);
        var sinT = new Float32Array(THETA_STEPS);
        for (var i = 0; i < THETA_STEPS; i++) {
            var theta = (i / THETA_STEPS) * Math.PI * 2;
            cosT[i] = Math.cos(theta);
            sinT[i] = Math.sin(theta);
        }

        var cosP = new Float32Array(PHI_STEPS);
        var sinP = new Float32Array(PHI_STEPS);
        for (var j = 0; j < PHI_STEPS; j++) {
            var phi = (j / PHI_STEPS) * Math.PI * 2;
            cosP[j] = Math.cos(phi);
            sinP[j] = Math.sin(phi);
        }

        // Character cells are taller than they are wide, so the vertical axis is
        // divided by that ratio to keep the donut circular rather than squashed.
        var extent = Math.min(cols, rows * cellAspect);
        var K1 = (extent * FILL) / (2 * MAX_PROJ);
        var invAspect = 1 / cellAspect;
        var cx = cols / 2;
        var cy = rows / 2;

        function frame(A, B) {
            zbuf.fill(0);
            out.fill(0);

            var cosA = Math.cos(A), sinA = Math.sin(A);
            var cosB = Math.cos(B), sinB = Math.sin(B);
            var cosAsinB = cosA * sinB;
            var cosAcosB = cosA * cosB;
            var sinAcosB = sinA * cosB;
            var sinAsinB = sinA * sinB;
            var lumSp = cosA + sinAcosB;
            var lumSt = cosAcosB - sinA;

            for (var i = 0; i < THETA_STEPS; i++) {
                var ct = cosT[i], st = sinT[i];
                var circleX = R2 + R1 * ct;
                var circleY = R1 * st;

                // Per-theta constants, so the inner loop is a handful of multiplies.
                var xa = circleX * cosB, xb = circleX * sinAsinB, xc = circleY * cosAsinB;
                var ya = circleX * sinB, yb = circleX * sinAcosB, yc = circleY * cosAcosB;
                var za = cosA * circleX, zc = K2 + circleY * sinA;
                var la = ct * sinB, lb = ct * lumSp, lc = st * lumSt;

                for (var j = 0; j < PHI_STEPS; j++) {
                    var cp = cosP[j], sp = sinP[j];

                    var L = la * cp - lb * sp + lc;
                    if (L <= 0) continue;  // surface faces away from the light

                    var ooz = 1 / (za * sp + zc);
                    var xp = (cx + K1 * ooz * (xa * cp + xb * sp - xc)) | 0;
                    if (xp < 0 || xp >= cols) continue;
                    var yp = (cy - K1 * ooz * (ya * cp - yb * sp + yc) * invAspect) | 0;
                    if (yp < 0 || yp >= rows) continue;

                    var idx = yp * cols + xp;
                    if (ooz > zbuf[idx]) {
                        zbuf[idx] = ooz;
                        var l = (L * 8) | 0;
                        out[idx] = (l > 11 ? 11 : l) + 1;
                    }
                }
            }

            for (var r = 0; r < rows; r++) {
                var base = r * cols;
                for (var k = 0; k < cols; k++) {
                    var v = out[base + k];
                    rowCodes[k] = v === 0 ? 32 : codes[v - 1];
                }
                lines[r] = String.fromCharCode.apply(null, rowCodes);
            }
            return lines.join('\n');
        }

        return { cols: cols, rows: rows, frame: frame };
    }

    function mount() {
        var el = document.getElementById('donut');
        if (!el) return;

        var renderer = null;
        var A = 1.0, B = 0.55;  // a pose that reads as a donut from the first frame
        var last = 0, lastDraw = 0, rafId = 0;
        var resizeTimer = 0;
        var motion = window.matchMedia('(prefers-reduced-motion: reduce)');

        function measureCell() {
            var probe = document.createElement('span');
            var cs = window.getComputedStyle(el);
            probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:pre;margin:0;padding:0;';
            probe.style.fontFamily = cs.fontFamily;
            probe.style.fontSize = cs.fontSize;
            probe.style.lineHeight = cs.lineHeight;
            probe.style.letterSpacing = cs.letterSpacing;
            probe.textContent = 'M'.repeat(64) + '\n' + 'M'.repeat(64);
            document.body.appendChild(probe);
            var rect = probe.getBoundingClientRect();
            probe.parentNode.removeChild(probe);
            return { w: rect.width / 64 || 8, h: rect.height / 2 || 14 };
        }

        function layout() {
            var cell = measureCell();
            var cols = Math.max(24, Math.ceil(window.innerWidth / cell.w) + 1);
            var rows = Math.max(16, Math.ceil(window.innerHeight / cell.h) + 1);
            renderer = createRenderer(cols, rows, cell.h / cell.w);
        }

        function draw() {
            el.textContent = renderer.frame(A, B);
            el.classList.add('is-ready');
        }

        function loop(now) {
            rafId = window.requestAnimationFrame(loop);
            var dt = Math.min((now - last) / 1000, 0.1);
            last = now;
            A += ROT_A * dt;
            B += ROT_B * dt;
            if (now - lastDraw < FRAME_MS) return;
            lastDraw = now;
            draw();
        }

        function start() {
            if (rafId || motion.matches) return;
            last = window.performance.now();
            lastDraw = 0;
            rafId = window.requestAnimationFrame(loop);
        }

        function stop() {
            if (!rafId) return;
            window.cancelAnimationFrame(rafId);
            rafId = 0;
        }

        layout();
        draw();
        start();

        window.addEventListener('resize', function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                layout();
                draw();
            }, 150);
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop(); else start();
        });

        var onMotionChange = function () {
            if (motion.matches) stop(); else start();
        };
        if (motion.addEventListener) motion.addEventListener('change', onMotionChange);
        else if (motion.addListener) motion.addListener(onMotionChange);
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = { createRenderer: createRenderer };
    } else if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', mount);
        } else {
            mount();
        }
    }
})();
