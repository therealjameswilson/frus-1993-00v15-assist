const notes=document.querySelector("#notes");const key=`frus-notes:${document.body.dataset.docId}`;if(notes){notes.value=localStorage.getItem(key)||"";notes.addEventListener("input",()=>localStorage.setItem(key,notes.value))}for(const button of document.querySelectorAll("[data-copy]")){button.addEventListener("click",async()=>{await navigator.clipboard.writeText(button.dataset.copy);const old=button.textContent;button.textContent="Copied";setTimeout(()=>button.textContent=old,1200)})}const data=window.FRUS_RESEARCH;const lanes=document.querySelector('[data-render="lanes"]');if(lanes&&data){lanes.innerHTML=data.lanes.map(lane=>`<article class="card"><span class="tag">${lane.status}</span><h3>${lane.label}</h3><p>${lane.next_action}</p></article>`).join("")}const sourceLinks=document.querySelector('[data-render="source-links"]');if(sourceLinks&&data){sourceLinks.innerHTML=data.source_leads.map(lead=>`<a class="source" href="${lead.url}" rel="noreferrer"><strong>${lead.label}</strong><span>${lead.category}</span></a>`).join("")}const gaps=document.querySelector('[data-render="gaps"]');if(gaps&&data){gaps.innerHTML=data.gap_register.map(gap=>`<article class="gap"><h3>${gap.area}</h3><p><strong>Fix:</strong> ${gap.fix}</p><p><strong>Status:</strong> ${gap.status}</p></article>`).join("")}for(const button of document.querySelectorAll(".tab-button")){button.addEventListener("click",()=>{for(const item of document.querySelectorAll(".tab-button"))item.setAttribute("aria-pressed",String(item===button));for(const panel of document.querySelectorAll("[data-panel]"))panel.hidden=panel.dataset.panel!==button.dataset.tab})}const exportButton=document.querySelector("[data-export]");if(exportButton&&data){exportButton.addEventListener("click",async()=>{await navigator.clipboard.writeText(JSON.stringify(data,null,2));const old=exportButton.textContent;exportButton.textContent="Copied JSON";setTimeout(()=>exportButton.textContent=old,1200)})}
// Keep the tables in sync with the canonical research data without changing saved notes.
(() => {
  if (!window.FRUS_RESEARCH) return;
  const d = window.FRUS_RESEARCH;
  const cell = (text, url) => {
    const td = document.createElement('td');
    const child = url ? document.createElement('a') : document.createElement('span');
    child.textContent = text || '—';
    if (url) { child.href = url; child.rel = 'noreferrer'; }
    td.append(child); return td;
  };
  const rows = (panel, records, columns) => {
    const body = document.querySelector(`[data-panel="${panel}"] tbody`);
    if (!body) return;
    body.replaceChildren(...records.map(record => {
      const row = document.createElement('tr');
      for (const column of columns) row.append(cell(...column(record)));
      return row;
    }));
  };
  rows('sources', d.source_leads, [r => [r.label, r.url], r => [r.category], r => [r.use], r => [r.status]]);
  rows('documents', d.document_candidates, [r => [r.title, r.url], r => [r.repository], r => [r.status], r => [(r.date ? `${r.date}. ` : '') + r.action]]);
  rows('chronology', [...d.chronology].sort((a,b) => a.date.localeCompare(b.date)), [r => [r.date], r => [r.label, r.source], r => [r.note], r => [r.status]]);
})();
