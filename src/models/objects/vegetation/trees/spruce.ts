import { Color3, Color4, Material, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";




export function createSpruce(name: string, height: number, treePosition: Vector3, trunkMat: Material, leavesMat: Material, scene: Scene) {


    const trunkHeight = height / 4
    const trunkDiameter = height / 18
    const trunkTessellation = Math.floor(Math.random() * 8 + 6);
    const leavesHeight = height / 2
    const leavesDiameter = height / 4
    const diameterBottom = height / (Math.random() + 3);
    const leavesTessellation = Math.floor(Math.random() * 6 + 5);



    const trunk = MeshBuilder.CreateCylinder(name + "trunk", { height: trunkHeight, diameter: trunkDiameter, tessellation: trunkTessellation }, scene);
    trunk.position = new Vector3(treePosition.x, trunkHeight / 2, treePosition.z)
    trunk.material = trunkMat

    // Tree Foliage (Leaves)
    const leaves = MeshBuilder.CreateCylinder(name + "leaves", { diameterTop: 0, diameterBottom, diameter: leavesDiameter, height: leavesHeight, tessellation: leavesTessellation }, scene);
    leaves.position = new Vector3(treePosition.x, trunkHeight + leavesHeight / 2, treePosition.z)
    leaves.material = leavesMat

    // Combine Trunk and Leaves into a single mesh
    const tree = Mesh.MergeMeshes([trunk, leaves], true, true, undefined, false, true);
    tree.name = name
    tree.id = "tree" + name
    tree.computeWorldMatrix(true);
    // Randomly place the tree in the scene
    //  tree.position.x = Math.random() * 10 - 5; // X position between -5 and 5
    //  tree.position.z = Math.random() * 10 - 5; // Z position between -5 and 5


    return tree
}

