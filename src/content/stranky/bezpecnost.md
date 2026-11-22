---
title: AI ako bezpečnostný problém
lead: >-
  Nemusíš veriť scenárom o superinteligencii, aby si videl problém. Stačí sa pozrieť, čo modely
  dokážu v kybernetickej bezpečnosti už dnes a ako rýchlo sa to mení.
description: Čo dnes vieme o využití AI pri kybernetických útokoch, ako rýchlo rastú schopnosti modelov a čo z toho vyplýva.
---

## Čo sa už stalo

- **Špionážna kampaň vedená AI.** V septembri 2025 zachytila firma Anthropic skupinu, ktorú
  s vysokou istotou pripisuje čínskemu štátu. Skupina zmanipulovala nástroj Claude Code tak, aby
  sa pokúsil preniknúť do približne tridsiatich organizácií, a v niekoľkých prípadoch uspela.
  Podľa Anthropic vykonala AI 80 až 90 % práce a ľudia zasahovali len v niekoľkých kľúčových
  bodoch. [Správa Anthropic, november 2025](https://www.anthropic.com/news/disrupting-AI-espionage)
- **Ransomvér, ktorý si kód píše sám.** V auguste 2025 našli výskumníci ESET-u vzorku nazvanú
  PromptLock: ransomvér, ktorý si škodlivé skripty necháva generovať jazykovým modelom.
  [Oznámenie ESET](https://www.eset.com/us/about/newsroom/research/eset-discovers-promptlock-the-first-ai-powered-ransomware/).
  Ukázalo sa, že ide o akademický prototyp z New York University, nie o nástroj zločincov.
  To je dobrá aj zlá správa: taký nástroj dokázal postaviť malý univerzitný tím.
  [Vyjadrenie NYU](https://engineering.nyu.edu/news/ai-powered-ransomware-sparked-concern-was-nyus-work)
- **Bežná prax útočníkov.** Medzinárodná správa o bezpečnosti AI z februára 2026 konštatuje, že
  pribúdajú dôkazy o využití AI pri skutočných kybernetických útokoch a že ju aktívne používajú
  zločinecké skupiny aj skupiny napojené na štáty. V jednej súťaži našiel AI agent 77 %
  zraniteľností prítomných v reálnom softvéri.
  [International AI Safety Report 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026)

## Okno na prípravu sa skracuje

Najschopnejšie modely majú zatiaľ uzavreté váhy a prístup k nim kontroluje výrobca. Modely
s otvorenými váhami si môže ktokoľvek stiahnuť, upraviť a zbaviť ochranných obmedzení, a raz
zverejnený model sa už nedá stiahnuť späť.

Britský AI Security Institute v júli 2026 zmeral, že otvorené modely zaostávajú v kybernetických
schopnostiach za uzavretou špičkou o 4 až 7 mesiacov. Počas väčšiny roka 2025 to bolo 6 až 10
mesiacov. Inštitút z toho vyvodzuje, že obrancovia majú len krátky čas pripraviť sa na to, že
dnešné špičkové schopnosti budú dostupné bez ochranných obmedzení.
[AISI, júl 2026](https://www.aisi.gov.uk/blog/how-far-behind-the-frontier-are-leading-open-weight-models-on-cyber)

Netýka sa to len bezpečnosti. Organizácia METR meria, aké dlhé softvérové úlohy dokážu modely
dokončiť samostatne. V roku 2025 zistila, že táto dĺžka sa zdvojnásobuje približne každých
sedem mesiacov.
[METR, marec 2025](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)

## Čo to neznamená

- **Neznamená to, že útočníci už vyhrali.** Tá istá medzinárodná správa hovorí, že zatiaľ nie
  je jasné, či AI pomôže viac útočníkom alebo obrancom. Tie isté schopnosti pomáhajú hľadať
  a opravovať zraniteľnosti.
- **Výsledok v teste nie je výsledok v reálnej sieti.** Testy bežia v prostredí bez živých
  obrancov a bez detekcie. Úspech v nich ukazuje, čo model dokáže proti slabo chránenému cieľu.
- **Časť čísel pochádza od samotných výrobcov.** Najvyššie výsledky v grafe vyššie uvádzajú
  vývojári vo vlastnej dokumentácii k modelom.

## Prečo to súvisí s našimi požiadavkami

Kybernetické schopnosti nie sú samostatná funkcia, ktorú možno vypnúť. Rastú spolu so všeobecnou
schopnosťou modelov plánovať, písať kód a pracovať samostatne. Ďalšia generácia modelov bude
v tomto lepšia, či to niekto chce, alebo nie.

Dnes pritom neexistuje nezávislý orgán, ktorý by pred tréningom alebo vydaním modelu overil, čo
dokáže. Medzinárodná správa navyše upozorňuje, že spoľahlivé testovanie pred nasadením je čoraz
ťažšie: modely čoraz častejšie rozlišujú medzi testom a skutočným nasadením.

Samotné váhy modelov sú navyše cieľom útokov. Štúdia RAND opisuje, ako ich chrániť pred krádežou
a aké náročné je ubrániť ich pred najschopnejšími útočníkmi.
[RAND, Securing AI Model Weights](https://www.rand.org/pubs/research_reports/RRA2849-1.html)

Preto žiadame to isté, čo je bežné v každom inom rizikovom odvetví: nezávislé overenie pred
nasadením, povinné hlásenie incidentov a medzinárodný dohľad nad tréningom najvýkonnejších
systémov. Podrobnosti sú v [našich požiadavkách](/#poziadavky).
