import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { DecryptedText } from "~/components/decrypted-text";
import { Button } from "~/components/ui/button";

function isDark() {
  return document.documentElement.classList.contains("dark");
}

export default function CatchAll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    import("three").then((THREE) => {
      if (cancelled || !container) return;

      // ─── Scene ───────────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.1,
        100,
      );
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // ─── Helpers ─────────────────────────────────────────────────────────
      const dark = () => isDark();
      const fgColor = () => (dark() ? 0xffffff : 0x0a0a0a);
      const fgOpacity = (base: number) => (dark() ? base : base * 0.6);

      // ─── Main icosahedron ────────────────────────────────────────────────
      const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
      const icoMat = new THREE.MeshBasicMaterial({
        color: fgColor(),
        wireframe: true,
        transparent: true,
        opacity: fgOpacity(0.2),
      });
      const ico = new THREE.Mesh(icoGeo, icoMat);
      scene.add(ico);

      // ─── Orbiting octahedron ─────────────────────────────────────────────
      const octGeo = new THREE.OctahedronGeometry(0.55);
      const octMat = new THREE.MeshBasicMaterial({
        color: fgColor(),
        wireframe: true,
        transparent: true,
        opacity: fgOpacity(0.28),
      });
      const oct = new THREE.Mesh(octGeo, octMat);
      scene.add(oct);

      // ─── Particles ───────────────────────────────────────────────────────
      const PARTICLE_COUNT = 120;
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const r = 3.5 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const ptMat = new THREE.PointsMaterial({
        color: fgColor(),
        size: 0.045,
        transparent: true,
        opacity: fgOpacity(0.55),
        sizeAttenuation: true,
      });
      const points = new THREE.Points(ptGeo, ptMat);
      scene.add(points);

      // ─── Theme observer ───────────────────────────────────────────────────
      const themeObserver = new MutationObserver(() => {
        const c = fgColor();
        icoMat.color.setHex(c);
        icoMat.opacity = fgOpacity(0.2);
        octMat.color.setHex(c);
        octMat.opacity = fgOpacity(0.28);
        ptMat.color.setHex(c);
        ptMat.opacity = fgOpacity(0.55);
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // ─── Mouse parallax ───────────────────────────────────────────────────
      let mx = 0;
      let my = 0;
      let cx = 0;
      let cy = 0;
      const onMouseMove = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      // ─── Resize ───────────────────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", onResize);

      // ─── Animation loop ───────────────────────────────────────────────────
      const clock = new THREE.Clock();
      let raf: number;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        ico.rotation.x = t * 0.1;
        ico.rotation.y = t * 0.16;

        oct.rotation.x = -t * 0.28;
        oct.rotation.y = t * 0.22;
        oct.position.x = Math.cos(t * 0.38) * 2.6;
        oct.position.y = Math.sin(t * 0.28) * 1.3;
        oct.position.z = Math.sin(t * 0.2) * 0.6;

        points.rotation.y = t * 0.035;
        points.rotation.x = t * 0.018;

        cx += (mx * 0.45 - cx) * 0.045;
        cy += (my * 0.45 - cy) * 0.045;
        camera.position.x = cx;
        camera.position.y = cy;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };
      animate();

      // ─── Cleanup ──────────────────────────────────────────────────────────
      dispose = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        themeObserver.disconnect();
        icoGeo.dispose();
        icoMat.dispose();
        octGeo.dispose();
        octMat.dispose();
        ptGeo.dispose();
        ptMat.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden">
      {/* Three.js canvas mount point */}
      <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />

      {/* Content overlay */}
      <div className="relative z-10 flex select-none flex-col items-center gap-5 text-center">
        <p className="font-mono text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">
          err_code_404
        </p>

        <h1 className="text-[clamp(5rem,16vw,10rem)] font-bold leading-none tracking-tighter">
          <DecryptedText text="404" />
        </h1>

        <p className="max-w-88 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button
          nativeButton={false}
          variant={"outline"}
          render={<Link to="/" />}
        >
          Go back home
        </Button>
      </div>
    </div>
  );
}
