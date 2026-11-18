const fs = require("fs");
const path = require("path");

const dir = __dirname;
const origem = process.argv[2] || path.join(dir, "rim.glb");
const destino = path.join(dir, "rim.glb");

function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function mul(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
function len(a) { return Math.hypot(a[0], a[1], a[2]); }
function norm(a) { const l = len(a) || 1; return mul(a, 1 / l); }
function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function basis(dir) {
    const d = norm(dir);
    const helper = Math.abs(d[1]) < 0.85 ? [0, 1, 0] : [1, 0, 0];
    const x = norm(cross(helper, d));
    const y = cross(d, x);
    return [x, y];
}

function malhaVazia() {
    return { positions: [], normals: [], indices: [] };
}

function tubo(mesh, points, radii, radial) {
    const rings = [];
    for (let i = 0; i < points.length; i++) {
        let dir;
        if (i === 0) dir = sub(points[1], points[0]);
        else if (i === points.length - 1) dir = sub(points[i], points[i - 1]);
        else dir = sub(points[i + 1], points[i - 1]);
        const [bx, by] = basis(dir);
        const ring = [];
        for (let k = 0; k < radial; k++) {
            const ang = (k / radial) * Math.PI * 2;
            const off = add(mul(bx, Math.cos(ang) * radii[i]), mul(by, Math.sin(ang) * radii[i]));
            const pos = add(points[i], off);
            const nrm = norm(off);
            ring.push(mesh.positions.length / 3);
            mesh.positions.push(pos[0], pos[1], pos[2]);
            mesh.normals.push(nrm[0], nrm[1], nrm[2]);
        }
        rings.push(ring);
    }
    for (let i = 0; i < rings.length - 1; i++) {
        for (let k = 0; k < radial; k++) {
            const k2 = (k + 1) % radial;
            const a = rings[i][k];
            const b = rings[i][k2];
            const c = rings[i + 1][k];
            const d = rings[i + 1][k2];
            mesh.indices.push(a, c, b, b, c, d);
        }
    }
}

function caixaDe(positions) {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < positions.length; i += 3) {
        for (let k = 0; k < 3; k++) {
            min[k] = Math.min(min[k], positions[i + k]);
            max[k] = Math.max(max[k], positions[i + k]);
        }
    }
    const centro = min.map((v, i) => (v + max[i]) / 2);
    const tamanho = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
    return [centro[0], centro[1], centro[2], tamanho];
}

const papilas = {
    a: [-0.0572, 0.312, -0.0232],
    b: [-0.0607, 0.3128, -0.0262],
    c: [-0.0658, 0.3077, -0.018],
    d: [-0.0643, 0.3071, -0.0209],
    e: [-0.0656, 0.3008, -0.0064],
    f: [-0.0566, 0.2901, -0.006],
    g: [-0.0666, 0.2728, 0.0035],
    h: [-0.0625, 0.267, 0.0073],
    i: [-0.0685, 0.2612, 0.0042],
    j: [-0.0603, 0.2616, 0.0103]
};
const hilo = [-0.0556, 0.2889, 0.0033];
const grupos = {
    superior: ["a", "b", "c", "d"],
    medio: ["e", "f"],
    inferior: ["g", "h", "i", "j"]
};

function media(chaves) {
    const pts = chaves.map((k) => papilas[k]);
    return pts.reduce((acc, p) => add(acc, p), [0, 0, 0]).map((v) => v / pts.length);
}

const Z = 0.001;
const bocaDaPelve = [-0.046, 0.289, Z];
const corpoDaPelve = [-0.041, 0.286, Z];
const jup = [-0.037, 0.274, Z];
const ureter = [
    jup,
    [-0.035, 0.248, Z],
    [-0.032, 0.210, Z],
    [-0.029, 0.168, Z],
    [-0.027, 0.128, Z]
];
const hubs = {
    superior: [-0.051, 0.307, Z],
    medio: [-0.049, 0.293, Z],
    inferior: [-0.051, 0.268, Z]
};

const pecas = [];

function guardar(nome, cor, mesh) {
    pecas.push({ nome, cor, mesh, caixa: caixaDe(mesh.positions) });
}

const corMenor = [0.98, 0.9, 0.58, 1];
const corMaior = [0.96, 0.72, 0.34, 1];
const corPelve = [0.9, 0.5, 0.26, 1];
const corJup = [0.72, 0.28, 0.22, 1];
const corUreter = [0.84, 0.62, 0.38, 1];

for (const [grupo, letras] of Object.entries(grupos)) {
    const hub = hubs[grupo];
    const pescocos = {};
    for (const letra of letras) {
        const ponta = papilas[letra];
        const pescoco = [-0.056, ponta[1], Z];
        pescocos[letra] = pescoco;
        const borda = mix(ponta, pescoco, 0.22);
        const meio = mix(borda, pescoco, 0.55);
        const mesh = malhaVazia();
        tubo(mesh, [borda, meio, pescoco], [0.0038, 0.0028, 0.002], 18);
        const perto = mix(pescoco, hub, 0.78);
        tubo(mesh, [pescoco, mix(pescoco, perto, 0.5), perto], [0.002, 0.0022, 0.0023], 14);
        guardar("minor_calyx_R_" + letra, corMenor, mesh);
    }
    const tronco = malhaVazia();
    tubo(tronco, [hub, mix(hub, bocaDaPelve, 0.5), bocaDaPelve], [0.0028, 0.0034, 0.004], 18);
    const nome = grupo === "superior" ? "major_calyx_superior_R" : grupo === "medio" ? "major_calyx_middle_R" : "major_calyx_inferior_R";
    guardar(nome, corMaior, tronco);
}

const pelve = malhaVazia();
tubo(pelve, [bocaDaPelve, corpoDaPelve, mix(corpoDaPelve, jup, 0.55), jup], [0.0042, 0.0054, 0.0034, 0.0022], 18);
guardar("renal_pelvis_R", corPelve, pelve);

const juncao = malhaVazia();
tubo(juncao, [mix(corpoDaPelve, jup, 0.45), jup, mix(jup, ureter[1], 0.35)], [0.0023, 0.00155, 0.0019], 16);
guardar("ureteropelvic_junction_R", corJup, juncao);

const tuboUreter = malhaVazia();
tubo(tuboUreter, ureter, ureter.map(() => 0.00215), 16);
guardar("ureter_R", corUreter, tuboUreter);

function lerGlb(arquivo) {
    const b = fs.readFileSync(arquivo);
    const jsonLen = b.readUInt32LE(12);
    const json = JSON.parse(b.slice(20, 20 + jsonLen).toString("utf8"));
    const binStart = 20 + jsonLen + 8;
    const binLen = b.readUInt32LE(20 + jsonLen);
    return { json, bin: b.slice(binStart, binStart + binLen) };
}

if (lerGlb(origem).json.materials.some((m) => m.name === "ureter_R")) {
    console.error("A base já tem a via urinária. Passe o GLB original do parênquima.");
    process.exit(1);
}

const { json, bin } = lerGlb(origem);
const partes = [bin];
let offset = bin.length;

function alinhar(n) {
    const falta = (4 - (offset % 4)) % 4;
    if (falta) {
        partes.push(Buffer.alloc(falta));
        offset += falta;
    }
    return n;
}

for (const peca of pecas) {
    alinhar();
    const pos = Buffer.alloc(peca.mesh.positions.length * 4);
    const nor = Buffer.alloc(peca.mesh.normals.length * 4);
    for (let i = 0; i < peca.mesh.positions.length; i++) pos.writeFloatLE(peca.mesh.positions[i], i * 4);
    for (let i = 0; i < peca.mesh.normals.length; i++) nor.writeFloatLE(peca.mesh.normals[i], i * 4);
    const idx = Buffer.alloc(peca.mesh.indices.length * 2);
    for (let i = 0; i < peca.mesh.indices.length; i++) idx.writeUInt16LE(peca.mesh.indices[i], i * 2);

    const bvPos = json.bufferViews.length;
    json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: pos.length, target: 34962 });
    partes.push(pos);
    offset += pos.length;
    alinhar();
    const bvNor = json.bufferViews.length;
    json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: nor.length, target: 34962 });
    partes.push(nor);
    offset += nor.length;
    alinhar();
    const bvIdx = json.bufferViews.length;
    json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: idx.length, target: 34963 });
    partes.push(idx);
    offset += idx.length;

    const verts = peca.mesh.positions.length / 3;
    const aPos = json.accessors.length;
    json.accessors.push({
        bufferView: bvPos, componentType: 5126, count: verts, type: "VEC3",
        min: [0, 1, 2].map((k) => Math.min(...peca.mesh.positions.filter((_, i) => i % 3 === k))),
        max: [0, 1, 2].map((k) => Math.max(...peca.mesh.positions.filter((_, i) => i % 3 === k)))
    });
    const aNor = json.accessors.length;
    json.accessors.push({ bufferView: bvNor, componentType: 5126, count: verts, type: "VEC3" });
    const aIdx = json.accessors.length;
    json.accessors.push({ bufferView: bvIdx, componentType: 5123, count: peca.mesh.indices.length, type: "SCALAR" });

    const mat = json.materials.length;
    json.materials.push({
        name: peca.nome,
        doubleSided: true,
        pbrMetallicRoughness: { baseColorFactor: peca.cor, roughnessFactor: 0.42, metallicFactor: 0 }
    });
    const meshIndex = json.meshes.length;
    json.meshes.push({
        name: "VH_M_" + peca.nome,
        primitives: [{ attributes: { POSITION: aPos, NORMAL: aNor }, indices: aIdx, material: mat, mode: 4 }]
    });
    const node = json.nodes.length;
    json.nodes.push({ name: "VH_M_" + peca.nome, mesh: meshIndex });
    json.nodes[0].children.push(node);
}

const binFinal = Buffer.concat(partes);
json.buffers[0].byteLength = binFinal.length;
let texto = JSON.stringify(json);
while (texto.length % 4) texto += " ";
const jsonBuf = Buffer.from(texto);
const total = 12 + 8 + jsonBuf.length + 8 + binFinal.length;
const out = Buffer.alloc(total);
out.writeUInt32LE(0x46546c67, 0);
out.writeUInt32LE(2, 4);
out.writeUInt32LE(total, 8);
out.writeUInt32LE(jsonBuf.length, 12);
out.writeUInt32LE(0x4e4f534a, 16);
jsonBuf.copy(out, 20);
out.writeUInt32LE(binFinal.length, 20 + jsonBuf.length);
out.writeUInt32LE(0x004e4942, 24 + jsonBuf.length);
binFinal.copy(out, 28 + jsonBuf.length);
fs.writeFileSync(destino, out);

for (const peca of pecas) {
    const c = peca.caixa.map((n) => Number(n.toFixed(4)));
    console.log(peca.nome, c.join(", "));
}
console.log("bytes", out.length);
