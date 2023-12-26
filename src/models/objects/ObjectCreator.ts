import { AbstractMesh, Color3, GroundMesh, Material, Mesh, MeshBuilder, Scene, SceneLoader, ShadowGenerator, StandardMaterial, Vector2, Vector3 } from "@babylonjs/core";
import { createOak } from "./vegetation/trees/oak";
import { createSpruce } from "./vegetation/trees/spruce";
import { createClouds1 } from "./environment/clouds";
import { POLYHEDRA } from "../polyhedra";

export enum GROUND_TYPE {
    GRAS = "GRAS",
    DESERT = "DESERT",
    ROCK = "GRAROCKS",
    WATER = "WATER",
    DIRT = "DIRT",
    UNDER_EARTH = "UNDER_EARTH"
}

export class ObjectCreator {

    scene: Scene
    shadowGenerator: ShadowGenerator
    zero = new Vector3(1, 0, 1)

    constructor(scene: Scene, shadowGenerator: ShadowGenerator) {
        this.scene = scene
        this.shadowGenerator = shadowGenerator
    }

    createWorld() {
        this.createGround(GROUND_TYPE.GRAS)
        // this.createRocks(2000)
        // this.createRockClones(2000)
        this.createRockInstances(2000)
        // this.createRandomTrees(800)
        // this.createAnimals(5)
    }


    createGround(type: GROUND_TYPE, position?: Vector2) {
        const ground = MeshBuilder.CreateGround("ground" + type, { width: 1000, height: 1000 }, this.scene);
        ground.id = "ground"
        ground.receiveShadows = true;
        const groundMat = new StandardMaterial("groundMat" + type, this.scene);
        ground.material = groundMat;

        switch (type) {
            case GROUND_TYPE.GRAS:
                groundMat.diffuseColor = new Color3(0, 0.4, 0);
                groundMat.specularColor = new Color3(0, 0.1, 0);
                groundMat.emissiveColor = new Color3(0, 0.1, 0);

                break;
            case GROUND_TYPE.DESERT:
                groundMat.diffuseColor = new Color3(0.9, 0.8, 0);
                groundMat.specularColor = new Color3(1, 0.9, 0);
                groundMat.emissiveColor = new Color3(1, 0.9, 0);

                break;
            case GROUND_TYPE.ROCK:
                groundMat.diffuseColor = new Color3(0.66, 0.66, 0.66);
                groundMat.specularColor = new Color3(0.8, 0.8, 0.8);
                groundMat.emissiveColor = new Color3(0.8, 0.8, 0.8);

                break;
            case GROUND_TYPE.DIRT:
                groundMat.diffuseColor = new Color3(0.5, 0.3, 0.1);
                groundMat.specularColor = new Color3(0.65, 0.45, 0.25);
                groundMat.emissiveColor = new Color3(0.65, 0.45, 0.25);

                break;
            case GROUND_TYPE.WATER:
                groundMat.diffuseColor = new Color3(0.2, 0.3, 0.7);
                groundMat.specularColor = new Color3(0.4, 0.5, 0.9);
                groundMat.emissiveColor = new Color3(0.4, 0.5, 0.9);

                break;
            case GROUND_TYPE.UNDER_EARTH:
                groundMat.diffuseColor = new Color3(0.3, 0.2, 0);
                groundMat.specularColor = new Color3(0.4, 0.3, 0);
                groundMat.emissiveColor = new Color3(0.4, 0.3, 0);

                break;

            default:
                break;
        }
    }

    createOctagonGround() {
        // const groundMat = new StandardMaterial("groundMat", scene);
        // groundMat.diffuseColor = new Color3(0, 0.4, 0);
        const ground = MeshBuilder.CreateDisc("groundOctagon", { tessellation: 6 }, this.scene);
        // ground.material = groundMat;
        // ground.receiveShadows = true;
    }

    createClouds() {
        createClouds1(this.scene)
    }

    createRocks(count?: number) {
        const ground = (this.scene.getMeshById("ground") as GroundMesh)
        const area = new Vector2(ground._width - 10, ground._height - 10);
        const rockMat = new StandardMaterial("rockMat", this.scene);
        rockMat.diffuseColor = new Color3(0.3, 0.3, 0.3);
        rockMat.specularColor = new Color3(0.6, 0.6, 0.6);
        rockMat.emissiveColor = new Color3(0.4, 0.4, 0.4);
        const value = count ? count : 100

        for (let i = 0; i < value; i++) {
            console.log("new rock" + i);

            const size = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            const sizeX = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            const sizeY = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            const sizeZ = Math.floor(Math.random() * (5 - 2 + 1) + 2)

            const rockPosition = new Vector3(0, 0, 0)
            rockPosition.x = Math.floor(Math.random() * area.x - area.x / 2);
            rockPosition.z = Math.floor(Math.random() * area.y - area.y / 2);
            rockPosition.y = sizeY / 2
            if (!this.isSpaceOccupied(rockPosition, 3)) {

                const rock = MeshBuilder.CreatePolyhedron("rock" + i, { custom: POLYHEDRA.J84, size, sizeX, sizeY, sizeZ }, this.scene);
                rock.rotation = new Vector3(sizeX, sizeY, sizeZ)
                rock.computeWorldMatrix(true);
                rock.position = rockPosition

                rock.material = rockMat;
                rock.id = rock.name
                rock.computeWorldMatrix(true);
                this.shadowGenerator.addShadowCaster(rock);
            }

        }

    }

    createRockInstances(count?: number) {
        const ground = (this.scene.getMeshById("ground") as GroundMesh)
        const area = new Vector2(ground._width - 10, ground._height - 10);
        const rockMat = new StandardMaterial("rockMat", this.scene);
        rockMat.diffuseColor = new Color3(0.3, 0.3, 0.3);
        rockMat.specularColor = new Color3(0.6, 0.6, 0.6);
        rockMat.emissiveColor = new Color3(0.4, 0.4, 0.4);
        const value = count ? count : 100

        let size = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        let sizeX = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        let sizeY = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        let sizeZ = Math.floor(Math.random() * (5 - 2 + 1) + 2)

        const rock = MeshBuilder.CreatePolyhedron("rock_root", { custom: POLYHEDRA.J84, size, sizeX, sizeY, sizeZ }, this.scene);
        rock.material = rockMat
        for (let i = 0; i < value; i++) {
            console.log("new rock" + i);

            size = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            sizeX = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            sizeY = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            sizeZ = Math.floor(Math.random() * (5 - 2 + 1) + 2)

            const rockPosition = new Vector3(0, 0, 0)
            rockPosition.x = Math.floor(Math.random() * area.x - area.x / 2);
            rockPosition.z = Math.floor(Math.random() * area.y - area.y / 2);
            rockPosition.y = sizeY / 2

            if (!this.isSpaceOccupied(rockPosition, 3)) {

                // const clonedRock = rock.clone()
                const clonedRock = rock.createInstance("rock" + i)
                clonedRock.rotation = new Vector3(sizeX, sizeY, sizeZ)
                clonedRock.position = rockPosition
                // clonedRock.material = rockMat;
                clonedRock.id = clonedRock.name
                clonedRock.computeWorldMatrix(true);
                this.shadowGenerator.addShadowCaster(clonedRock);
            }
        }
    }

    createRockClones(count?: number) {
        const ground = (this.scene.getMeshById("ground") as GroundMesh)
        const area = new Vector2(ground._width - 10, ground._height - 10);
        const rockMat = new StandardMaterial("rockMat", this.scene);
        rockMat.diffuseColor = new Color3(0.3, 0.3, 0.3);
        rockMat.specularColor = new Color3(0.6, 0.6, 0.6);
        rockMat.emissiveColor = new Color3(0.4, 0.4, 0.4);
        const value = count ? count : 100

        let size = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        let sizeX = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        let sizeY = Math.floor(Math.random() * (5 - 2 + 1) + 2)
        let sizeZ = Math.floor(Math.random() * (5 - 2 + 1) + 2)

        const rock = MeshBuilder.CreatePolyhedron("rock_root", { custom: POLYHEDRA.J84, size, sizeX, sizeY, sizeZ }, this.scene);
        for (let i = 0; i < value; i++) {
            console.log("new rock" + i);

            size = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            sizeX = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            sizeY = Math.floor(Math.random() * (5 - 2 + 1) + 2)
            sizeZ = Math.floor(Math.random() * (5 - 2 + 1) + 2)

            const rockPosition = new Vector3(0, 0, 0)
            rockPosition.x = Math.floor(Math.random() * area.x - area.x / 2);
            rockPosition.z = Math.floor(Math.random() * area.y - area.y / 2);
            rockPosition.y = sizeY / 2

            if (!this.isSpaceOccupied(rockPosition, 3)) {

                // const clonedRock = rock.clone()
                const clonedRock = rock.clone("rock" + i)
                clonedRock.rotation = new Vector3(sizeX, sizeY, sizeZ)
                clonedRock.position = rockPosition
                clonedRock.material = rockMat;
                clonedRock.id = clonedRock.name
                clonedRock.computeWorldMatrix(true);
                this.shadowGenerator.addShadowCaster(clonedRock);
            }
        }
    }

    createRandomTrees(count?: number) {
        const ground = (this.scene.getMeshById("ground") as GroundMesh)
        const area = new Vector2(ground._width - 10, ground._height - 10);
        const trunkMat = new StandardMaterial("trunkMat", this.scene);
        trunkMat.diffuseColor = new Color3(0.45, 0.30, 0);
        trunkMat.emissiveColor = new Color3(0.25, 0.1, 0);
        trunkMat.specularColor = new Color3(0.40, 0.25, 0);
        const needlesMat = new StandardMaterial("needlesMat", this.scene);
        needlesMat.diffuseColor = new Color3(0, 0.5, 0);
        needlesMat.emissiveColor = new Color3(0, 0.3, 0);
        needlesMat.specularColor = new Color3(0, 0.1, 0);
        const leavesMat = new StandardMaterial("leavesMat", this.scene);
        leavesMat.diffuseColor = new Color3(0.4, 0.8, 0);
        leavesMat.emissiveColor = new Color3(0.2, 0.6, 0);
        leavesMat.specularColor = new Color3(0, 0.1, 0);

        const value = count ? count : 100

        for (let i = 0; i < value; i++) {
            const height = Math.floor(Math.random() * (50 - 5 + 1) + 5)
            const treePosition = new Vector3(0, 0, 0)
            treePosition.x = Math.floor(Math.random() * area.x - area.x / 2);
            treePosition.z = Math.floor(Math.random() * area.y - area.y / 2);
            let mesh: Mesh;
            if (!this.isSpaceOccupied(treePosition, 3)) {
                if (treePosition.x % 2) {
                    mesh = createSpruce("spruce" + i, height, treePosition, trunkMat, needlesMat, this.scene)
                } else {
                    mesh = createOak("oak" + i, height, treePosition, trunkMat, leavesMat, this.scene)
                }
                this.shadowGenerator.addShadowCaster(mesh);
            }
        }
    }

    duplicate = function (container, position, delay) {
        let entries = container.instantiateModelsToScene();

        for (var node of entries.rootNodes) {
            node.position = position
        }

        setTimeout(() => {
            for (var group of entries.animationGroups) {
                group.play(true);
            }
        }, delay);
    }

    createAnimals(count?: number) {
        const ground = (this.scene.getMeshById("ground") as GroundMesh)
        const area = new Vector2(ground._width - 10, ground._height - 10);
        const value = count ? count : 100
        SceneLoader.LoadAssetContainer("./animals/set/", "Deer.glb", this.scene, (container) => {
            // container.addAllToScene();
            for (let index = 0; index < value; index++) {
                const animalPosition = new Vector3(0, 0, 0)
                animalPosition.x = Math.floor(Math.random() * area.x - area.x / 2);
                animalPosition.z = Math.floor(Math.random() * area.y - area.y / 2);
                this.duplicate(container, animalPosition, 2)
            }
        })
    }

    isSpaceOccupied(position: Vector3, offset: number) {
        if (this.scene.meshes.length === 0) return false
        const mesh = this.scene.meshes.find(m => (m.id.startsWith("tree") || m.id.startsWith("rock")) && m.getBoundingInfo().boundingBox.centerWorld.multiply(this.zero).subtract(position.multiply(this.zero)).length() <= offset)
        if (mesh) return true
        else return false
    }
}

