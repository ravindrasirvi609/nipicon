"use client";
import React, { useEffect, useRef } from "react";
import Matter, { Events } from "matter-js";

const FloatingElements: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, World, Bodies, Body, Runner } = Matter;

    // Create engine and renderer
    const engine = Engine.create({
      gravity: { x: 0, y: 0 },
    });
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    // Create floating elements
    const elements = [
      { text: "AI", color: "#FF6B6B" },
      { text: "ML", color: "#4ECDC4" },
      { text: "Drug Discovery", color: "#45B7D1" },
      { text: "Research", color: "#FFA07A" },
      { text: "Innovation", color: "#98D8C8" },
    ];

    // Create bodies with random positions and colors
    const bodies = elements.map((element) => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      return Bodies.circle(x, y, 40, {
        render: {
          fillStyle: element.color,
        },
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        slop: 0,
        mass: 1, // Set a consistent, low mass
      });
    });

    // Function to create walls
    const createWalls = () => {
      const wallOptions = {
        isStatic: true,
        render: { visible: false },
        restitution: 1,
      };
      return [
        Bodies.rectangle(
          window.innerWidth / 2,
          -10,
          window.innerWidth,
          20,
          wallOptions
        ),
        Bodies.rectangle(
          window.innerWidth / 2,
          window.innerHeight + 10,
          window.innerWidth,
          20,
          wallOptions
        ),
        Bodies.rectangle(
          -10,
          window.innerHeight / 2,
          20,
          window.innerHeight,
          wallOptions
        ),
        Bodies.rectangle(
          window.innerWidth + 10,
          window.innerHeight / 2,
          20,
          window.innerHeight,
          wallOptions
        ),
      ];
    };

    // Add bodies and walls to the world
    World.add(engine.world, [...bodies, ...createWalls()]);

    // Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Resize handler
    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      World.clear(engine.world, false);
      World.add(engine.world, [...bodies, ...createWalls()]);
    };

    window.addEventListener("resize", handleResize);

    // Initial velocity
    bodies.forEach((body) => {
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      });
    });

    // Keep elements moving
    const moveElements = () => {
      bodies.forEach((body) => {
        const forceMagnitude = 0.0005;
        const angle = Math.random() * Math.PI * 2;
        Body.applyForce(body, body.position, {
          x: Math.cos(angle) * forceMagnitude,
          y: Math.sin(angle) * forceMagnitude,
        });
      });
    };

    // Use the Matter.js built-in update loop
    Events.on(engine, "beforeUpdate", moveElements);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      render.canvas = null as any;
      render.context = null as any;
      render.textures = {};
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
};

export default FloatingElements;
