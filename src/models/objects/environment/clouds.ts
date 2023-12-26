import { Color3, Color4, Mesh, MeshBuilder, NoiseBlock, Scene, StandardMaterial, Vector3, VertexBuffer } from "@babylonjs/core";
import Noise from "noise-ts";

export function createClouds1(scene: Scene) {

    // Cloud-like Mesh with Randomness
    const cloud = MeshBuilder.CreateSphere("cloud", { diameter: 5, segments: 32 }, scene);
    const cloudPosition = new Vector3(0, 0, 0)
    // cloudPosition = Math.floor(Math.random() * area.x - area.x / 2);
    const cloudMaterial = new StandardMaterial("cloudMaterial", scene);
    cloudMaterial.diffuseColor = new Color3(0.4, 0.8, 0);
    cloudMaterial.alpha = 0.8

    cloud.material = cloudMaterial

    // Use noisejs to add randomness to the cloud's surface
    const seed = Math.random();
    let noise = new Noise(seed)
    var vertices = cloud.getVerticesData(VertexBuffer.PositionKind);

    for (var i = 0; i < vertices.length; i += 3) {
        var x = vertices[i];
        var y = vertices[i + 1];
        var z = vertices[i + 2];

        // Add Perlin noise to the vertices
        var noiseValue = noise.simplex3(x * 0.2, y * 0.2, z * 0.2);
        vertices[i] += noiseValue * 0.5;
        vertices[i + 1] += noiseValue * 0.5;
        vertices[i + 2] += noiseValue * 0.5;
    }

    cloud.updateVerticesData(VertexBuffer.PositionKind, vertices);

}