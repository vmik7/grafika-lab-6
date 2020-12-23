// Отображаемая функция y = f(x, z)
let f = (x, z) => Math.sin(x / 40) * Math.cos(x / 40) * Math.cos(z / 40) * 40;

//
let primaryColor = `rgb(255,46,99)`;
let backColor = `rgb(8,217,214)`;

// Инициализация canvas
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Сокращения для sin и cos
let cos = Math.cos;
let sin = Math.sin;

// Объявление переменных
let k = 700;    // масштаб
let a1 = 0.55;    // первый угол
let a2 = -0.38;   // второй угол
let far = 260;    // расстояние от наблюдателя
let p;            // начальная точка при повороте графика
let w, h;         // ширина и высота окна     
let points = [];  // массив для точек графика
let s = 100;      // масштаб осей

// Инициализация точек
for (var x = -s; x < s; x += 5) {
    for (var z = -s; z < s; z += 3) {
        points.push({ x, y: f(x, z), z, r: 2, state: {} });
    }
}

// Разноцветный график
// points.forEach((d) => (d.color = `rgb(${d.x + s},${d.y + s},${d.z + s})`));

// Проектирование 3D графика на плоскости
function project(p) {
  // Поворот в пространстве задается двумя углами: a1 и a2
  let x = p.x * cos(a1) + p.z * sin(a1);
  let z = p.z * cos(a1) - p.x * sin(a1);
  let y = p.y * cos(a2) + z * sin(a2);
  let d = z * cos(a2) - p.y * sin(a2) + far;

  // Используем центральную проекцию и сдвигаем график в центр
  p.state.cx = (k / d) * x + w / 2;
  p.state.cy = (k / d) * y + h / 2;
  p.state.r = (far / d) * p.r;
}

// Рендеринг
function render() {
    // Проектируем все точки графика
    points.forEach(project);

    // Сортировка точек по радиусу
    // points.sort((a, b) => a.state.r - b.state.r);

    let horY = [], horR = [];
    for (let i = 0; i <= w; i++) {
        horR[i] = 0;
        horY[i] = 0;
    }

    points.forEach((p) => {
        if (p.state.r > horR[Math.floor(p.state.cx)]) {
            horY[Math.floor(p.state.cx)] = p.state.cy;
            horR[Math.floor(p.state.cx)] = p.state.r;
        }
    });

    points.forEach((p) => {
        if (p.state.cy <= horY[Math.floor(p.state.cx)]) {
            p.color = primaryColor;
        }
        else {
            p.color = backColor;
        }
    });


    // Очищаем холст
    ctx.clearRect(0, 0, w, h);

    // Рисуем точки
    points.forEach(drawPoint);
}

// Рисует точку
function drawPoint(p) {
  ctx.beginPath();
  ctx.arc(p.state.cx, p.state.cy, p.state.r, 0, 2 * Math.PI);
  ctx.fillStyle = p.color;
  ctx.fill();
}

// Вешаем события на изменение масштаба / поворот
window.addEventListener("wheel", (e) => {
  k *= 1 - Math.sign(e.deltaY) * 0.1;
  render();
});
window.addEventListener("mouseup", (e) => {
  p = null;
  render();
});
window.addEventListener("mousedown", (e) => {
  p = { x: e.x, y: e.y, a1, a2 };
  render();
});
window.addEventListener("mousemove", (e) => {
  if (p) {
    a1 = p.a1 - (e.x - p.x) / 100;
    a2 = p.a2 - (e.y - p.y) / 100;
  }
  render();
});
window.addEventListener("resize", (e) => {
  w = canvas.width = innerWidth - 20;
  h = canvas.height = innerHeight - 20;
  render();
});

// Вызываем событие 'resize'
window.dispatchEvent(new Event("resize"));
