import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, Color3, Vector2, UniversalCamera, PointerEventTypes, SceneLoader, AbstractMesh, AssetsManager, Tools, ShadowGenerator, CreateSphere, DirectionalLight, PointLight, LightGizmo, UtilityLayerRenderer, ShadowDepthWrapper, RecastJSPlugin } from "@babylonjs/core";
import { GROUND_TYPE, ObjectCreator } from "./models/objects/ObjectCreator";
import { lightFragment } from "@babylonjs/core/Shaders/ShadersInclude/lightFragment";

class App {
    constructor() {

        const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
        // canvas.style.width = "100%";
        // canvas.style.height = "100%";
        // canvas.id = "gameCanvas";
        document.body.appendChild(canvas);



        // initialize babylon scene and engine
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);
        const utilLayer = new UtilityLayerRenderer(scene)
        const isDayNightCycle = false

        const sunLightPosition = new Vector3(500, 500, 0)
        const moonLightPosition = new Vector3(-500, -500, 0)
        // const sunLight = new PointLight("sun", sunLightPosition, scene);
        // sunLight.intensity = 0.1
        // sunLight.diffuse = new Color3(1, 1, 0);
        // sunLight.specular = new Color3(1, 1, 0);

        const sunLightDirection = new Vector3(0, -1, 0)
        const sunLight = new DirectionalLight("sun", sunLightDirection, scene);
        sunLight.intensity = 1
        sunLight.diffuse = new Color3(1, 1, 0);
        sunLight.specular = new Color3(0, 0, 0);

        const moonLightDirection = new Vector3(0, 1, 0)
        const moonLight = new DirectionalLight("moon", moonLightDirection, scene);
        moonLight.intensity = 0.5
        moonLight.diffuse = new Color3(0.9, 0.9, 0.9);
        moonLight.specular = new Color3(0, 0, 0);

        const sunSphere = MeshBuilder.CreateSphere("sun", { diameter: 10 }, scene);
        sunSphere.position = sunLightPosition
        const sunMat = new StandardMaterial("sunLightMat", scene);
        sunMat.emissiveColor = new Color3(1, 1, 0);
        sunSphere.material = sunMat

        const moonSphere = MeshBuilder.CreateSphere("moon", { diameter: 7 }, scene);
        moonSphere.position = moonLightPosition
        const moonMat = new StandardMaterial("moonLightMat", scene);
        moonMat.emissiveColor = new Color3(0.9, 0.9, 0.9);
        moonSphere.material = moonMat

        const shadowGenerator = new ShadowGenerator(1024, sunLight);
        shadowGenerator.setDarkness(0.3)
        shadowGenerator.usePercentageCloserFiltering = true
        shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_HIGH
        // shadowGenerator.useBlurExponentialShadowMap = true
        // shadowGenerator.useKernelBlur = true;
        // shadowGenerator.blurKernel = 64




        // const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        const camera: ArcRotateCamera = new ArcRotateCamera("Camera", 0, 0.8, 300, Vector3.Zero(), scene);
        // camera.upperBetaLimit = Math.PI / 2.2;
        // camera.lowerBetaLimit = Math.PI / 5;
        // camera.upperRadiusLimit = 600
        // camera.lowerRadiusLimit = 50
        camera.attachControl(canvas, true);
        camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");

        // const sunLightGizmo = new LightGizmo()
        // sunLightGizmo.light = sunLight

        // const moonLightGizmo = new LightGizmo()
        // moonLightGizmo.light = moonLight

        const objectCreator = new ObjectCreator(scene, shadowGenerator)
        objectCreator.createWorld()




        // objectCreator.createGround(GROUND_TYPE.GRAS)
        // objectCreator.createRocks()
        // objectCreator.createRandomTrees()
        // objectCreator.createAnimals()



        const dummyTarget = Vector3.Zero();
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
            if (ev.key === "w") {
                console.log("www");
                camera.cameraDirection.addInPlace(camera.getDirection(Vector3.Forward()).scale(0.9));
            } else if (ev.key === "s") {
                console.log("sss");
                const cameraForward = dummyTarget.subtract(camera.position).normalize();
                const cameraBack = Vector3.Cross(camera.upVector, cameraForward);
                cameraBack.scaleInPlace(-1);
                dummyTarget.subtractInPlace(cameraBack);
                camera.setTarget(dummyTarget);
            } else if (ev.key === "a") {
                console.log("aaa");
                const cameraForward = dummyTarget.subtract(camera.position).normalize();
                const cameraLeft = Vector3.Cross(camera.upVector, cameraForward);
                cameraLeft.scaleInPlace(1);
                dummyTarget.subtractInPlace(cameraLeft);
                camera.setTarget(dummyTarget);
            } else if (ev.key === "d") {
                console.log("ddd");
                const cameraForward = dummyTarget.subtract(camera.position).normalize();
                const cameraRight = Vector3.Cross(camera.upVector, cameraForward);
                cameraRight.scaleInPlace(-1);
                dummyTarget.subtractInPlace(cameraRight);
                camera.setTarget(dummyTarget);
            }
        });


        let pickedMeshes: AbstractMesh[] = []
        const zero = new Vector3(1, 0, 1)
        // Double-tap: If you double-tap on mesh, highlight and set that mesh as the target
        // Else, reset target to center of view with a radius of 10
        scene.onPointerObservable.add((eventData) => {
            const mesh = eventData.pickInfo.pickedMesh;
            const pickedPoint = eventData.pickInfo.pickedPoint;


            if (mesh.id.startsWith("tree") || mesh.id.startsWith("rock")) {
                console.log(`Target: ${mesh.name}`);
                console.log(mesh);
                if (!mesh.renderOutline) {
                    pickedMeshes.push(mesh)
                    if (pickedMeshes.length >= 2) {
                        console.log(pickedMeshes[pickedMeshes.length - 2].getBoundingInfo().boundingBox.centerWorld.multiply(zero).subtract(pickedMeshes[pickedMeshes.length - 1].getBoundingInfo().boundingBox.centerWorld.multiply(zero)).length());
                    }
                } else {
                    pickedMeshes = pickedMeshes.filter(m => m.id !== mesh.id)
                }
                console.log(pickedMeshes);
                mesh.renderOutline = !mesh.renderOutline
                mesh.outlineWidth = 0.5;
            } else if (mesh.name.startsWith("Geo_Deer")) {
                console.log(`Target: ${mesh.name}`);
                mesh.renderOutline = !mesh.renderOutline
                mesh.outlineWidth = 2;
            } else if (mesh.name.startsWith("ground")) {
                console.log(`Target: ${mesh.name}`);
                mesh.renderOutline = !mesh.renderOutline
                mesh.outlineWidth = 1;
                const height = Math.floor(Math.random() * (10 - 2 + 1) + 2)
                const rotation = Math.floor(Math.random() * (360 - 10 + 1) + 10)
                const position = new Vector3(pickedPoint._x, 0, pickedPoint._z)


                // SceneLoader.ImportMesh("", "./Deer/", "Deer.glb", scene, (meshes) => {

                //     meshes[0].scaling = new Vector3(0.1, 0.1, 0.1);
                //     meshes[0].position = new Vector3(pickedPoint._x, pickedPoint._y + 7, pickedPoint._z)
                //     meshes[0].rotation = new Vector3(0, rotation, 0)
                //     // shadowGenerator.addShadowCaster(meshes[0]);
                //     // shadowGenerator.getShadowMap().renderList.push(meshes[0]);
                // })

                // createSpruce("tree" + "click", height, treePosition, scene)

            }

        }, PointerEventTypes.POINTERPICK);


        // Animations
        let alpha = 0;
        scene.beforeRender = function () {

            if (isDayNightCycle) {
                sunLight.position = new Vector3(500 * Math.sin(alpha), 500 * Math.cos(alpha), 0);
                sunLight.direction = new Vector3(-500 * Math.sin(alpha), -500 * Math.cos(alpha), 0);

                moonLight.position = new Vector3(-500 * Math.sin(alpha), -500 * Math.cos(alpha), 0);
                moonLight.direction = new Vector3(500 * Math.sin(alpha), 500 * Math.cos(alpha), 0);
                sunLight.intensity = (sunLight.position._y / 500) + 0.1
                moonLight.intensity = (moonLight.position._y / 2000) + 0.05

                if (sunLight.position._y <= -10) { // under surface
                    sunLight.setEnabled(false);
                    sunSphere.visibility = 0
                    moonLight.setEnabled(true);
                    moonSphere.visibility = 1

                } else {
                    sunLight.setEnabled(true);
                    sunSphere.visibility = 1
                    moonLight.setEnabled(false);
                    moonSphere.visibility = 0
                }
                sunSphere.position = sunLight.position;
                moonSphere.position = moonLight.position;

                alpha += 0.001;
            }

        };


        scene.meshes.find(m => m.id === "rock10").renderOutline = true
        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();