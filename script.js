// Oggetto contenente le aliquote base stimate per l'addizionale regionale.
const regioni = {
  "Abruzzo": 1.73,
  "Basilicata": 1.23,
  "Calabria": 1.73,
  "Campania": 2.03,
  "Emilia-Romagna": 1.33,
  "Friuli-Venezia Giulia": 1.23,
  "Lazio": 1.73,
  "Liguria": 1.23,
  "Lombardia": 1.23,
  "Marche": 1.23,
  "Molise": 1.73,
  "Piemonte": 1.23,
  "Puglia": 1.23,
  "Sardegna": 1.23,
  "Sicilia": 1.23,
  "Toscana": 1.42,
  "Trentino-Alto Adige": 1.23,
  "Umbria": 1.23,
  "Valle d'Aosta": 1.23,
  "Veneto": 1.23
};

/**
 * Popola un elemento <select> con le opzioni delle regioni.
 * @param {string} selectId - L'ID dell'elemento <select> da popolare.
 */
function popolaSelectRegione(selectId) {
  const select = document.getElementById(selectId);
  if (!select) {
    console.error(`Elemento select con ID "${selectId}" non trovato.`);
    return;
  }
  // Svuota eventuali opzioni esistenti (utile se chiamata più volte, anche se qui è on-load)
  select.innerHTML = ''; 
  for (let regione in regioni) {
    const option = document.createElement("option");
    option.value = regioni[regione]; // Il valore è l'aliquota percentuale
    option.textContent = `${regione} (${regioni[regione]}%)`;
    select.appendChild(option);
  }
}

// Popola i menu a tendina delle regioni al caricamento della pagina.
window.onload = function() {
  popolaSelectRegione("regioneRal");
  popolaSelectRegione("regioneMensileLordo");

  // Imposta la prima scheda come attiva di default
  // Assicurati che il selettore del bottone sia corretto e che l'elemento esista
  const primoBottoneTab = document.querySelector('.tabs .tab-button');
  if (primoBottoneTab) {
    mostraScheda('schedaCalcoloDaRal', primoBottoneTab);
  } else {
    // Se il primo bottone non viene trovato, mostra comunque la prima scheda per default
    // Questo è un fallback, idealmente il bottone dovrebbe essere trovato.
    const primaSchedaContenuto = document.getElementById('schedaCalcoloDaRal');
    if(primaSchedaContenuto) primaSchedaContenuto.classList.add('active');
  }
  
  // Aggiorna l'anno nel footer
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
  }
};

/**
 * Mostra la scheda specificata e aggiorna lo stato attivo dei bottoni.
 * @param {string} idScheda - L'ID del contenuto della scheda da mostrare.
 * @param {HTMLElement} elementoCliccato - Il bottone della scheda che è stato cliccato.
 */
function mostraScheda(idScheda, elementoCliccato) {
  // Nascondi tutti i contenuti delle schede
  const contenutiSchede = document.querySelectorAll(".tab-content");
  contenutiSchede.forEach(contenuto => {
    contenuto.classList.remove("active");
  });

  // Rimuovi la classe 'active' da tutti i bottoni delle schede
  const bottoniSchede = document.querySelectorAll(".tab-button");
  bottoniSchede.forEach(bottone => {
    bottone.classList.remove("active");
  });

  // Mostra il contenuto della scheda selezionata
  const schedaDaMostrare = document.getElementById(idScheda);
  if (schedaDaMostrare) {
    schedaDaMostrare.classList.add("active");
  } else {
    console.error("Contenuto scheda non trovato:", idScheda);
  }

  // Aggiungi la classe 'active' al bottone cliccato
  if (elementoCliccato) {
    elementoCliccato.classList.add("active");
  } else {
     // Se elementoCliccato non è fornito (es. chiamata da onload senza bottone),
     // cerca il bottone corrispondente all'idScheda e attivalo se necessario.
     // Questo è più per robustezza, la chiamata da onload dovrebbe fornire il bottone.
  }
}

/**
 * Calcola le detrazioni per lavoro dipendente (anno 2025).
 * @param {number} imponibileFiscale - L'imponibile fiscale annuo.
 * @returns {number} La detrazione annua spettante.
 */
function calcolaDetrazioniLavoroDipendente(imponibileFiscale) {
  let detrazione = 0;
  if (imponibileFiscale <= 0) return 0;

  if (imponibileFiscale <= 15000) {
    detrazione = 1910;
  } else if (imponibileFiscale <= 28000) {
    detrazione = 1910 + 1190 * ((28000 - imponibileFiscale) / 13000);
  } else if (imponibileFiscale <= 50000) {
    detrazione = 1910 * ((50000 - imponibileFiscale) / 22000);
  } else {
    detrazione = 0;
  }
  return Math.max(0, parseFloat(detrazione.toFixed(2)));
}

/**
 * Calcola il trattamento integrativo (ex Bonus Renzi) (anno 2025, semplificato).
 * @param {number} imponibileFiscale - L'imponibile fiscale annuo.
 * @param {number} irpefLorda - L'IRPEF lorda nazionale.
 * @param {number} detrazioneLavoroDipendente - La detrazione per lavoro dipendente.
 * @returns {number} Il trattamento integrativo annuo spettante.
 */
function calcolaTrattamentoIntegrativo(imponibileFiscale, irpefLorda, detrazioneLavoroDipendente) {
  let bonus = 0;
  if (imponibileFiscale <= 0) return 0;

  if (imponibileFiscale <= 15000) {
    if (irpefLorda > detrazioneLavoroDipendente) {
      bonus = 1200;
    }
  }
  return parseFloat(bonus.toFixed(2));
}

/**
 * Funzione principale di calcolo dello stipendio.
 * @param {number} ralInput - La RAL (o RAL stimata) da cui partire.
 * @param {number} aliquotaRegionalePercentuale - L'aliquota dell'addizionale regionale.
 * @param {number} numeroMensilitaPerNetto - Il numero di mensilità su cui calcolare il netto mensile.
 * @returns {object|null} Un oggetto con tutti i dettagli del calcolo, o null se l'input non è valido.
 */
function eseguiCalcoloStipendioPrincipale(ralInput, aliquotaRegionalePercentuale, numeroMensilitaPerNetto) {
  if (isNaN(ralInput) || ralInput <= 0) {
    return { errore: "Inserisci un valore RAL valido (numero positivo)." };
  }

  const contributiINPS = ralInput * 0.0919;
  const imponibileFiscale = ralInput - contributiINPS;

  if (imponibileFiscale <= 0) {
      return {
          ral: ralInput,
          contributiINPS: contributiINPS,
          imponibileFiscale: imponibileFiscale,
          irpefLordaNazionale: 0,
          detrazioneLavoroDipendente: 0,
          irpefNetta: 0,
          addizionaleRegionale: 0,
          addizionaleComunale: 0,
          trattamentoIntegrativo: 0,
          nettoAnnuo: 0,
          nettoMensile: 0,
          errore: "L'imponibile fiscale risulta nullo o negativo dopo i contributi INPS."
      };
  }

  let irpefLordaNazionale = 0;
  if (imponibileFiscale <= 15000) {
    irpefLordaNazionale = imponibileFiscale * 0.23;
  } else if (imponibileFiscale <= 28000) {
    irpefLordaNazionale = (15000 * 0.23) + ((imponibileFiscale - 15000) * 0.25);
  } else if (imponibileFiscale <= 50000) {
    irpefLordaNazionale = (15000 * 0.23) + (13000 * 0.25) + ((imponibileFiscale - 28000) * 0.35);
  } else {
    irpefLordaNazionale = (15000 * 0.23) + (13000 * 0.25) + (22000 * 0.35) + ((imponibileFiscale - 50000) * 0.43);
  }

  const detrazioneLavoroDipendente = calcolaDetrazioniLavoroDipendente(imponibileFiscale);
  let irpefNetta = Math.max(0, irpefLordaNazionale - detrazioneLavoroDipendente);

  const addizionaleRegionale = imponibileFiscale * (aliquotaRegionalePercentuale / 100);
  const addizionaleComunale = imponibileFiscale * 0.008; // Stima 0.8%
  const trattamentoIntegrativo = calcolaTrattamentoIntegrativo(imponibileFiscale, irpefLordaNazionale, detrazioneLavoroDipendente);

  const nettoAnnuo = imponibileFiscale - irpefNetta - addizionaleRegionale - addizionaleComunale + trattamentoIntegrativo;
  const nettoMensile = nettoAnnuo / (numeroMensilitaPerNetto || 13);

  return {
    ral: parseFloat(ralInput.toFixed(2)),
    contributiINPS: parseFloat(contributiINPS.toFixed(2)),
    imponibileFiscale: parseFloat(imponibileFiscale.toFixed(2)),
    irpefLordaNazionale: parseFloat(irpefLordaNazionale.toFixed(2)),
    detrazioneLavoroDipendente: parseFloat(detrazioneLavoroDipendente.toFixed(2)),
    irpefNetta: parseFloat(irpefNetta.toFixed(2)),
    addizionaleRegionale: parseFloat(addizionaleRegionale.toFixed(2)),
    addizionaleComunale: parseFloat(addizionaleComunale.toFixed(2)),
    trattamentoIntegrativo: parseFloat(trattamentoIntegrativo.toFixed(2)),
    nettoAnnuo: parseFloat(nettoAnnuo.toFixed(2)),
    nettoMensile: parseFloat(nettoMensile.toFixed(2))
  };
}

/**
 * Formatta e visualizza i risultati del calcolo in un div specificato.
 * @param {object} datiCalcolo - L'oggetto restituito da eseguiCalcoloStipendioPrincipale.
 * @param {string} idDivRisultato - L'ID del div dove visualizzare i risultati.
 * @param {number} [ralOriginaleOStimata] - La RAL originale o stimata.
 * @param {number} [mensileLordoInput] - Il mensile lordo inserito, se applicabile.
 * @param {number} [numeroMensilitaInput] - Il numero di mensilità inserito, se applicabile.
 */
function visualizzaRisultati(datiCalcolo, idDivRisultato, ralOriginaleOStimata, mensileLordoInput, numeroMensilitaInput) {
  const risultatoDiv = document.getElementById(idDivRisultato);
  if (!risultatoDiv) {
      console.error(`Div risultato con ID "${idDivRisultato}" non trovato.`);
      return;
  }

  if (!datiCalcolo || datiCalcolo.errore) {
    risultatoDiv.innerHTML = `<p class="errore-testo">${datiCalcolo ? datiCalcolo.errore : "Errore nel calcolo."}</p>`;
    return;
  }

  let htmlOutput = '';
  if (mensileLordoInput && numeroMensilitaInput) {
      htmlOutput += `<p>Lordo Mensile Inserito: € ${mensileLordoInput.toFixed(2)}</p>`;
      htmlOutput += `<p>Numero Mensilità: ${numeroMensilitaInput}</p>`;
      htmlOutput += `<p><strong>RAL Stimata: € ${datiCalcolo.ral.toFixed(2)}</strong></p><hr>`;
  } else {
      htmlOutput += `<p>RAL Inserita: € ${ralOriginaleOStimata.toFixed(2)}</p><hr>`;
  }

  htmlOutput += `
    <p>Contributi INPS (~9.19%): € ${datiCalcolo.contributiINPS.toFixed(2)}</p>
    <p>Imponibile Fiscale Annuo: € ${datiCalcolo.imponibileFiscale.toFixed(2)}</p>
    <p>IRPEF Lorda Nazionale: € ${datiCalcolo.irpefLordaNazionale.toFixed(2)}</p>
    <p>Detrazione Lavoro Dipendente: € ${datiCalcolo.detrazioneLavoroDipendente.toFixed(2)}</p>
    <p>IRPEF Netta Nazionale: € ${datiCalcolo.irpefNetta.toFixed(2)}</p>
    <p>Addizionale Regionale (su imponibile): € ${datiCalcolo.addizionaleRegionale.toFixed(2)}</p>
    <p>Addizionale Comunale (stima ~0.8% su imponibile): € ${datiCalcolo.addizionaleComunale.toFixed(2)}</p>
    <p>Trattamento Integrativo (Bonus): € ${datiCalcolo.trattamentoIntegrativo.toFixed(2)}</p>
    <hr>
    <p><strong>Netto Annuo Stimato: € ${datiCalcolo.nettoAnnuo.toFixed(2)}</strong></p>
    <p><strong>Netto Mensile Stimato (su ${numeroMensilitaInput || 13} mensilità): € ${datiCalcolo.nettoMensile.toFixed(2)}</strong></p>
  `;
  risultatoDiv.innerHTML = htmlOutput;
}

// Funzione per calcolare partendo dalla RAL.
function calcolaNettoDaRal() {
  const ralInput = parseFloat(document.getElementById("ral").value);
  const irpefRegSelect = document.getElementById("regioneRal");
  const risultatoDivId = "risultatoRal";
  
  if (!irpefRegSelect) {
      document.getElementById(risultatoDivId).innerHTML = `<p class="errore-testo">Errore: selettore regione non trovato.</p>`;
      return;
  }
  const irpefRegPercentuale = parseFloat(irpefRegSelect.value);

  if (isNaN(ralInput) || ralInput <= 0) {
    document.getElementById(risultatoDivId).innerHTML = `<p class="errore-testo">Inserisci una RAL valida (numero positivo).</p>`;
    return;
  }
   if (isNaN(irpefRegPercentuale)) {
    document.getElementById(risultatoDivId).innerHTML = `<p class="errore-testo">Seleziona una regione valida.</p>`;
    return;
  }

  const datiCalcolo = eseguiCalcoloStipendioPrincipale(ralInput, irpefRegPercentuale, 13);
  visualizzaRisultati(datiCalcolo, risultatoDivId, ralInput, undefined, 13);
}

// Funzione per calcolare partendo dal Mensile Lordo.
function calcolaNettoDaMensileLordo() {
  const mensileLordoInput = parseFloat(document.getElementById("mensileLordo").value);
  const numeroMensilitaSelect = document.getElementById("numeroMensilita");
  const irpefRegSelect = document.getElementById("regioneMensileLordo");
  const risultatoDivId = "risultatoMensileLordo";

  if (!numeroMensilitaSelect || !irpefRegSelect) {
      document.getElementById(risultatoDivId).innerHTML = `<p class="errore-testo">Errore: selettori mancanti.</p>`;
      return;
  }
  const numeroMensilita = parseInt(numeroMensilitaSelect.value);
  const irpefRegPercentuale = parseFloat(irpefRegSelect.value);


  if (isNaN(mensileLordoInput) || mensileLordoInput <= 0) {
    document.getElementById(risultatoDivId).innerHTML = `<p class="errore-testo">Inserisci un importo mensile lordo valido.</p>`;
    return;
  }
  if (isNaN(numeroMensilita) || (numeroMensilita !== 13 && numeroMensilita !== 14)) {
     document.getElementById(risultatoDivId).innerHTML = `<p class="errore-testo">Seleziona un numero di mensilità valido (13 o 14).</p>`;
    return;
  }
  if (isNaN(irpefRegPercentuale)) {
    document.getElementById(risultatoDivId).innerHTML = `<p class="errore-testo">Seleziona una regione valida.</p>`;
    return;
  }

  const ralStimata = mensileLordoInput * numeroMensilita;
  const datiCalcolo = eseguiCalcoloStipendioPrincipale(ralStimata, irpefRegPercentuale, numeroMensilita);
  visualizzaRisultati(datiCalcolo, risultatoDivId, ralStimata, mensileLordoInput, numeroMensilita);
}
