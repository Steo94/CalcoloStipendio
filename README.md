# Stima Stipendio Netto - Tool Online

## Descrizione

**Stima Stipendio Netto** è un'applicazione web front-end che permette agli utenti di calcolare una stima del proprio stipendio netto annuale e mensile partendo dalla Retribuzione Annua Lorda (RAL) o dal lordo mensile. Il tool tiene conto delle aliquote IRPEF, delle detrazioni per lavoro dipendente, delle addizionali regionali (con una selezione per regione) e comunali stimate, e del trattamento integrativo per l'anno fiscale 2025 in Italia.

## Funzionalità Principali

* Calcolo dello stipendio netto da RAL.
* Calcolo dello stipendio netto da lordo mensile (con stima della RAL basata su 13 o 14 mensilità).
* Selezione della regione per un calcolo più accurato dell'addizionale regionale.
* Visualizzazione dettagliata dei calcoli: contributi INPS, imponibile fiscale, IRPEF lorda e netta, addizionali, trattamento integrativo.
* Interfaccia utente responsive con schede per i due tipi di calcolo.
* Background animato con Particles.js.
* Tema chiaro e scuro basato sulle preferenze di sistema.

## Tecnologie Utilizzate

* **HTML5:** Per la struttura della pagina.
* **CSS3:** Per lo styling, variabili CSS, tema chiaro/scuro, e animazioni.
    * Font: Poppins (da Google Fonts).
* **JavaScript (Vanilla):** Per la logica di calcolo, la manipolazione del DOM, la gestione delle schede e il funzionamento del cursore personalizzato.
* **Particles.js:** Per l'effetto di background animato.

## Struttura del Progetto
├── index.html         # File HTML principale con la struttura della pagina

├── style.css          # Foglio di stile principale

├── script.js          # Script JavaScript per la logica dell'applicazione

└── README.md          # Questo file


## Installazione e Utilizzo

Non è richiesta un'installazione particolare trattandosi di un progetto front-end statico.

1.  Clona o scarica i file del progetto in una cartella locale.
2.  Apri il file `index.html` direttamente nel tuo browser web preferito (es. Google Chrome, Firefox, Edge).

### Come usare il calcolatore:

1.  Scegli la modalità di calcolo: "RAL → Netto" o "Mensile Lordo → Netto" usando le schede.
2.  **Per il calcolo da RAL:**
    * Inserisci la tua Retribuzione Annua Lorda nel campo apposito.
    * Seleziona la tua regione dal menu a tendina.
    * Clicca su "Calcola".
3.  **Per il calcolo da Mensile Lordo:**
    * Inserisci il tuo stipendio lordo mensile.
    * Seleziona il numero di mensilità (13 o 14) per stimare la RAL.
    * Seleziona la tua regione.
    * Clicca su "Calcola".
4.  Il risultato dettagliato apparirà sotto il modulo di input.

### Particles.js

La configurazione di Particles.js si trova direttamente nel file `index.html`, all'interno di un tag `<script>` in fondo alla pagina. Puoi modificare i parametri (numero di particelle, colori, velocità, interattività, ecc.) seguendo la documentazione di [Particles.js](https://github.com/VincentGarreau/particles.js/).


############### Disclaimer ###############

Questo calcolatore fornisce una **stima indicativa** e non sostituisce una consulenza fiscale professionale o i calcoli ufficiali. I risultati possono variare in base a specifiche situazioni contrattuali, detrazioni personali non considerate e aliquote comunali/regionali precise. I calcoli si basano sulle normative fiscali vigenti per l'anno 2025 (scaglioni IRPEF, detrazioni per lavoro dipendente).

