import { Color3, Color4, Material, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";


export function createOak(name: string, height: number, treePosition: Vector3, trunkMat: Material, leavesMat: Material, scene: Scene) {

    const trunkHeight = height / 4
    const trunkDiameter = height / 20
    const trunkTessellation = Math.floor(Math.random() * 8 + 6);
    const leavesHeight = height / 2
    const leavesDiameter = height / (Math.random() + 4);
    const leavesSegments = Math.floor(Math.random() * 5 + 2);


    const trunk = MeshBuilder.CreateCylinder(name + "trunk", { height: trunkHeight, diameter: trunkDiameter, tessellation: trunkTessellation }, scene);
    trunk.position = new Vector3(treePosition.x, trunkHeight / 2, treePosition.z)
    trunk.material = trunkMat

    // Tree Foliage (Leaves)
    const leaves = MeshBuilder.CreateSphere(name + "leaves", { diameter: leavesDiameter, segments: leavesSegments }, scene);
    leaves.position = new Vector3(treePosition.x, trunkHeight, treePosition.z)
    leaves.material = leavesMat

    // Combine Trunk and Leaves into a single mesh
    const tree = Mesh.MergeMeshes([trunk, leaves], true, true, undefined, false, true);
    tree.name = name
    tree.id = "tree" + name
    tree.computeWorldMatrix(true);

    return tree
}

