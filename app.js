const $info = document.querySelector('#info');
const $lista = document.querySelector('#lista');
const $top  = document.querySelector('#top');

async function cargarCursos() {
  const res = await fetch('./data/cursos.json');
  if (!res.ok) throw new Error('No se pudo cargar cursos.json');
  const data = await res.json();
  return data.slice(0, 10); // 10 cursos
}

// util: pintar en <ul>
function pintarLista($ul, items) {
  $ul.innerHTML = items.map(c => 
    `<li>
      <strong>${c.titulo}</strong>
      <span class="tag">${c.categoria}</span>
      <span class="tag">${c.horas}h</span>
      <span class="tag">nivel: ${c.nivel}</span>
    </li>`
  ).join('');
}

(async () => {
  try {
    const cursos = await cargarCursos();

    // 1) FILTER: por categoría (cambia 'frontend' por la que quieras)
    const categoriaObjetivo = 'devops';
    const filtrados = cursos.filter(c => c.categoria === categoriaObjetivo);

    // 2) MAP: deja solo los campos que quieres mostrar
    const mapeados = filtrados.map(c => ({
      titulo: c.titulo,
      categoria: c.categoria,
      horas: c.horas,
      nivel: c.nivel
    }));

    // 3) REDUCE: total de horas del filtrado
    const totalHoras = mapeados.reduce((acc, c) => acc + c.horas, 0);
    const promedioFiltrados = mapeados.length
    ? mapeados.reduce((acc, c) => acc + c.horas, 0) / mapeados.length
    : 0;

    // 4) TOP-3 por horas (sobre TODOS los cursos)
    const top3 = [...cursos]
      .sort((a, b) => b.init - a.init)
      .slice(0, 3);

    // Pintar
    $info.textContent =
    `Cursos cargados: ${cursos.length} — Filtrados por "${categoriaObjetivo}": ${mapeados.length} — ` +
    `Total de horas filtradas: ${totalHoras}h — Promedio filtrados: ${promedioFiltrados.toFixed(1)}h`;


    pintarLista($lista, mapeados);
    pintarLista($top, top3);

    // EXTRA: promedio de horas y validaciones
    const promedio = (cursos.reduce((a, c) => a + c.horas, 0) / cursos.length).toFixed(1);
    console.log('Promedio de horas (todos):', promedio);
  } catch (err) {
    console.error(err);
    $info.textContent = 'Error cargando datos. Revisa la consola.';
  }
})();
