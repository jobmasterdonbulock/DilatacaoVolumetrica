let grafico;
let cuboExterno = null;
let fatorAlvo = 1;

/* ========================= */
/* CALCULAR */
/* ========================= */

function calcular() {

    const V0 =
        parseFloat(document.getElementById("volume").value) || 0;

    const beta =
        parseFloat(document.getElementById("material").value) || 0;

    const tempInicial =
        parseFloat(document.getElementById("tempInicial").value) || 0;

    const tempFinal =
        parseFloat(document.getElementById("tempFinal").value) || 0;

    const deltaT =
        tempFinal - tempInicial;

    const deltaV =
        V0 * beta * deltaT;

    const volumeFinal =
        V0 + deltaV;

    document.getElementById("deltaT").textContent =
        `${deltaT.toFixed(0)} °C`;

    document.getElementById("deltaV").textContent =
        `${deltaV.toFixed(2)} cm³`;

    document.getElementById("volumeFinal").textContent =
        `${volumeFinal.toFixed(2)} cm³`;

    document.getElementById("coeficiente").textContent =
        (beta * 1000).toFixed(3) + " × 10⁻³ °C⁻¹";

    if(cuboExterno){

        const razaoVolume =
            Math.max(1 + beta * deltaT, 0);

        fatorAlvo = Math.sqrt(razaoVolume);
    }

    const temperaturaAtual =
        document.getElementById("temperaturaAtual");

    const temperaturaFinalVisual =
        document.getElementById("temperaturaFinalVisual");

    if(temperaturaAtual){
        temperaturaAtual.textContent =
            `${tempInicial}°C`;
    }

    if(temperaturaFinalVisual){
        temperaturaFinalVisual.textContent =
            `${tempFinal}°C`;
    }

    atualizarGrafico(
        V0,
        beta,
        tempInicial,
        tempFinal
    );

}

/* ========================= */
/* GRÁFICO */
/* ========================= */

function atualizarGrafico(
    V0,
    beta,
    tempInicial,
    tempFinal
){

    const canvas =
        document.getElementById(
            "graficoVolume"
        );

    if(!canvas){
        return;
    }

    const temperaturas = [

        tempInicial,

        (tempInicial + tempFinal) / 2,

        tempFinal

    ];

    const volumes =
        temperaturas.map(temp => {

            return V0 +
            (
                V0 *
                beta *
                (
                    temp -
                    tempInicial
                )
            );

        });

    if(grafico){

        grafico.data.labels =
            temperaturas.map(
                t => `${t}°C`
            );

        grafico.data.datasets[0].data =
            volumes;

        grafico.update();

        return;

    }

    grafico =
        new Chart(canvas, {

            type:"line",

            data:{

                labels:
                temperaturas.map(
                    t => `${t}°C`
                ),

                datasets:[{

                    label:"Volume",

                    data:volumes,

                    borderColor:"#6be7ff",

                    borderWidth:2,

                    tension:.3,

                    pointRadius:3,

                    pointBackgroundColor:"#6be7ff"

                }]
            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{
                    legend:{
                        labels:{
                            color:"white"
                        }
                    }
                },

                scales:{

                    x:{
                        ticks:{
                            color:"white"
                        }
                    },

                    y:{
                        ticks:{
                            color:"white"
                        }
                    }
                }
            }
        });
}

/* ========================= */
/* FORMULAS */
/* ========================= */

const formulas = [

    "ΔV = V₀ · β · ΔT",

    "V(T)=V₀(1+βΔT)",

    "β = 3α",

    "ΔT = Tf − Ti",

    "Vf = V₀ + ΔV"

];

function criarFormula(){

    const container =
        document.getElementById(
            "formulas-container"
        );

    if(!container){
        return;
    }

    const formula =
        document.createElement("div");

    formula.className =
        "formula";

    formula.textContent =
        formulas[
            Math.floor(
                Math.random() *
                formulas.length
            )
        ];

    formula.style.left =
        Math.random()*90 + "%";

    formula.style.top =
        Math.random()*90 + "%";

    formula.style.fontSize =
        (20 + Math.random()*12)
        + "px";

    container.appendChild(
        formula
    );

    setTimeout(() => {

        formula.remove();

    },15000);

}

/* ========================= */
/* CENA 3D */
/* ========================= */

const sceneContainer =
document.getElementById(
    "scene3d"
);

if(
    sceneContainer &&
    typeof THREE !== "undefined"
){

    const scene =
        new THREE.Scene();

    const camera =
        new THREE.PerspectiveCamera(
            60,
            sceneContainer.clientWidth /
            sceneContainer.clientHeight,
            0.1,
            5000
        );

    camera.position.set(
        10,
        8,
        10
    );

    camera.lookAt(
        0,
        0,
        0
    );

    const renderer =
        new THREE.WebGLRenderer({

            antialias:true,

            alpha:true

        });

    renderer.setSize(
        sceneContainer.clientWidth,
        sceneContainer.clientHeight
    );

    renderer.setPixelRatio(
        window.devicePixelRatio
    );

    sceneContainer.appendChild(
        renderer.domElement
    );

    scene.add(
        new THREE.AmbientLight(
            0xffffff,
            1.5
        )
    );

    const luz1 =
        new THREE.PointLight(
            0xaeefff,
            4
        );

    luz1.position.set(
        5,
        5,
        5
    );

    scene.add(
        luz1
    );

    const luz2 =
        new THREE.PointLight(
            0xffffff,
            2
        );

    luz2.position.set(
            -5,
            -5,
            5
    );

    scene.add(
        luz2
    );

    const geoInterno =
new THREE.BoxGeometry(
        4.0,
        4.0,
        4.0
);

    const matInterno =
        new THREE.MeshPhysicalMaterial({

            color:0x69ecff,

            transparent:true,

            opacity:0.45,

            roughness:0,

            transmission:1

        });

    const cuboInterno =
        new THREE.Mesh(
            geoInterno,
            matInterno
        );

    scene.add(
        cuboInterno
    );

    cuboInterno.position.set(
    0,
    0,
    0
);

    cuboInterno.add(

        new THREE.LineSegments(

            new THREE.EdgesGeometry(
                geoInterno
            ),

            new THREE.LineBasicMaterial({

                color:0x88ffff

            })

        )
    );

  const geoExterno =
new THREE.BoxGeometry(
    4.0,
    4.0,
    4.0
);

    const matExterno =
        new THREE.MeshPhysicalMaterial({

            color:0xfff2e4,

            transparent:true,

            opacity:0.12,

            roughness:0,

            transmission:1

        });

    cuboExterno =
        new THREE.Mesh(
            geoExterno,
            matExterno
        );

    scene.add(
        cuboExterno
    );

    cuboExterno.position.set(
    0,
    0,
    0
);

    cuboExterno.add(

        new THREE.LineSegments(

            new THREE.EdgesGeometry(
                geoExterno
            ),

            new THREE.LineBasicMaterial({

                color:0xffd9c0

            })

        )
    );


    const particulasGeo =
        new THREE.BufferGeometry();

    const vertices = [];

    for(let i=0;i<3000;i++){

        vertices.push(

            (Math.random()-0.5)*80,

            (Math.random()-0.5)*80,

            (Math.random()-0.5)*80

        );

    }

    particulasGeo.setAttribute(

        "position",

        new THREE.Float32BufferAttribute(
            vertices,
            3
        )

    );

    const particulas =
        new THREE.Points(

            particulasGeo,

            new THREE.PointsMaterial({

                color:0xffffff,

                size:0.06

            })

        );

    scene.add(
        particulas
    );

  function animar(){

    requestAnimationFrame(animar);

    if(cuboExterno){

        const diferenca =
            fatorAlvo - cuboExterno.scale.x;

        if(Math.abs(diferenca) > 0.001){

            const escalaSuave =
                cuboExterno.scale.x + diferenca * 0.2;

            cuboExterno.scale.set(
                escalaSuave,
                escalaSuave,
                escalaSuave
            );

        }else{

            cuboExterno.scale.setScalar(fatorAlvo);

        }
    }

    scene.rotation.x = -0.25;

    scene.rotation.y += 0.0015;

    renderer.render(
        scene,
        camera
    );

}

    animar();

    window.addEventListener(
        "resize",
        () => {

            const w =
                sceneContainer.clientWidth;

            const h =
                sceneContainer.clientHeight;

            camera.aspect =
                w / h;

            camera.updateProjectionMatrix();

            renderer.setSize(
                w,
                h
            );

        }
    );

}

/* ========================= */
/* EVENTOS */
/* ========================= */

document.getElementById("volume")
.addEventListener("input",calcular);

document.getElementById("material")
.addEventListener("change",calcular);

document.getElementById("tempInicial")
.addEventListener("input",calcular);

document.getElementById("tempFinal")
.addEventListener("input",calcular);

const slider =
document.getElementById(
    "sliderTemperatura"
);

if(slider){

    slider.addEventListener(
        "input",
        e => {

            document.getElementById(
                "tempFinal"
            ).value =
            e.target.value;

            calcular();

        }
    );

}

/* ========================= */
/* START */
/* ========================= */

setInterval(
    criarFormula,
    2000
);

criarFormula();

calcular();