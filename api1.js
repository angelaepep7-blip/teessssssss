// DAFTAR API. Tambah API baru = tambah satu blok di bawah (website otomatis ikut).
// Isi path & nama parameter dari halaman docs api.ranggacode.my.id (kategori Tools).
//
// Jenis input (fields[].type): text | number | textarea | select (butuh options:[...]) | file (foto)
// Tambah optional:true kalau kolomnya boleh kosong.
const BASE = "https://api.ranggacode.my.id";

// get(path, {namaInputDiForm: "namaParameterDiAPI"}) -> request GET (?param=nilai)
const get = (path, map) => (inputs, key) => {
  const q = new URLSearchParams();
  for (const [field, param] of Object.entries(map)) if (inputs[field]) q.set(param, inputs[field]);
  q.set("apikey", key); // kalau docs memakai nama lain (mis. key), ganti di sini
  return { url: `${BASE}${path}?${q}`, init: { headers: { "x-api-key": key } } };
};

// form(path, {...}) -> request POST multipart (dipakai kalau ada upload foto)
const form = (path, map) => (inputs, key) => {
  const fd = new FormData();
  for (const [field, param] of Object.entries(map)) {
    const v = inputs[field];
    if (v && v.buffer) fd.append(param, new Blob([v.buffer], { type: v.mime }), "foto." + (v.mime.split("/")[1] || "jpg"));
    else if (v) fd.append(param, v);
  }
  return { url: `${BASE}${path}`, init: { method: "POST", body: fd, headers: { "x-api-key": key } } };
};
// Key dikirim lewat header x-api-key. Kalau docs minta ?apikey=..., pindahkan ke query.

export const APIS = {
  getcode: {
    label: "Get Code (ambil kode website)",
    button: "💻 Ambil Kode",
    fields: [
      { name: "url", label: "Link website", type: "text", icon: "🔗", placeholder: "https://example.com" }
    ],
    build: get("/api/tools/getcode", { url: "url" })
  },

  mediafire: {
    label: "MediaFire Downloader",
    button: "⬇ Ambil Link Download",
    fields: [
      { name: "url", label: "Link MediaFire", type: "text", icon: "🔗", placeholder: "https://www.mediafire.com/file/..." }
    ],
    build: get("/api/downloader/mediafire", { url: "url" })
  }

  // TEMPLATE untuk API lain (hapus tanda // lalu isi dari docs):
  // editgambar: {
  //   label: "Edit gambar AI",
  //   button: "🎨 Edit Gambar",
  //   fields: [
  //     { name: "foto", label: "Upload foto", type: "file" },
  //     { name: "instruksi", label: "Instruksi edit", type: "textarea" }
  //   ],
  //   build: form("/api/tools/NAMA-ENDPOINT", { foto: "image", instruksi: "prompt" })
  // },
};
