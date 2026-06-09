const API_URL = "https://script.google.com/macros/s/AKfycbwwF3BwaV3xSqAbXpu1RByl8HLcoodjeA1vlNdne7ZF4lQayg_wyjfADUJ4WTs7s1TW/exec";
const ABSEN_API = "https://script.google.com/macros/s/AKfycbx52605R4M-KV3z0Ckv1PeXiTQ-ZAGCKMsCprx4y3vfIrU-vsLoxmKB12zCg_7B4Cz1gQ/exec";
const TABUNGAN_API = "https://script.google.com/macros/s/AKfycbz0eLjFRei6AjsfdIkTGjJ5_TYx2qhokCfD9FnPL3wwTB3bN8Cn4_fLapwSohsbZdhu/exec";
const JADWAL_API = "https://script.google.com/macros/s/AKfycbzE8W8Rd6coOfao7YLVZgW9-CWVPe6Nl3TQ0qy6X0r04oLbK1_brfl8yCq7HYysOSILMA/exec";
const Quiz_URL ="https://script.google.com/macros/s/AKfycbx76vMYaeEvwBdtM0sDrqFPDN7n78Z9qMVysyloix652KBctCHysJYRYyz3g2XjZWZ7/exec";

const HARI_LIBUR = ["2026-01-01","2026-01-27","2026-02-19","2026-03-29","2026-04-18","2026-05-01","2026-05-12","2026-06-01","2026-08-17","2026-12-25"];

let history = [];
let currentUser = null;
let dataSiswaGlobal = [];
let dataSiswaTabungan = [];
let dataSiswaRaport = [];
let dataSiswaKognitif = [];
let dataSoal=[];
