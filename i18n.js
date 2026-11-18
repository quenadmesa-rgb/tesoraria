// Tradução PT/EN de toda a interface. A app é escrita em português; em inglês, cada texto mostrado é trocado
// pelo do dicionário. Não toca no que as pessoas escrevem (campos e caixas de texto) nem nos nomes.
(function () {
  "use strict";
  const EN = {
    // ---- navegação e estrutura
    "Painel": "Dashboard", "Membros": "Members", "Cotas": "Dues", "Classificação": "Ranking", "Contribuições": "Contributions", "Conferências": "Conferences",
    "Actividades": "Activities", "Região de Pemba": "Pemba Region", "Ofertas": "Offerings", "Saídas": "Expenses", "Jovens e Liderança": "Youth & Leadership",
    "Jovens e liderança": "Youth & leadership", "Relatório mensal / anual": "Monthly / annual report", "Relatórios e dados": "Reports & data", "Utilizadores": "Users",
    "Geral": "General", "Finanças": "Finance", "Juventude": "Youth", "Relatórios": "Reports", "Administração": "Administration", "Mais": "More",
    "Todas as secções": "All sections", "Secções": "Sections", "Navegação principal": "Main navigation", "Fechar": "Close", "Ano": "Year",
    "Assembleia de Deus": "Assembly of God", "Africana": "African", "Assembleia de Deus Africana": "African Assembly of God",
    "Assembleia de Deus Africana · Avante na Fé": "African Assembly of God · Forward in Faith", "Assembleia de Deus Africana · Águias de Pemba": "African Assembly of God · Pemba Eagles",
    "Tesouraria da Juventude": "Youth Treasury", "Tesouraria da Juventude · Águias de Pemba": "Youth Treasury · Pemba Eagles", "Tesouraria da Juventude · {n}": "Youth Treasury · {n}",
    "Direcção da Juventude": "Youth Board", "Direcção da Juventude da Autonomia da Cidade das Águias de Pemba": "Youth Board of the Pemba Eagles City Autonomy", "Águias de Pemba": "Pemba Eagles",
    "Continuamos a andar nas coisas que aprendemos, estando enraizados e firmados na doutrina bíblica na nossa igreja, na união, no amor, nas orações, no perdoar de coração e no temor genuíno de Deus.": "We continue to walk in the things we have learned, rooted and grounded in biblical doctrine in our church, in unity, in love, in prayer, in forgiving from the heart and in the genuine fear of God.",
    "Filipenses {n} · {n} Timóteo {n} · Provérbios {n}": "Philippians {n} · {n} Timothy {n} · Proverbs {n}",
    // ---- entrada e conta
    "Entrar": "Sign in", "Entrar no sistema": "Sign in to the system", "Escreva o seu utilizador e a sua senha para aceder à tesouraria.": "Enter your username and password to access the treasury.",
    "Utilizador": "Username", "Senha": "Password", "O seu utilizador": "Your username", "A sua senha": "Your password", "Mostrar": "Show", "Esconder": "Hide",
    "Mostrar senha": "Show password", "Esconder senha": "Hide password", "Sair": "Sign out", "Sair do sistema": "Sign out", "Alterar a minha senha": "Change my password",
    "Sessão iniciada": "Signed in", "recomendado": "recommended", "ligado": "online", "ligados": "online", "ligado agora": "online now", "Ligados agora": "Online now", "Ligados agora ({n})": "Online now ({n})",
    "Primeira entrada": "First sign-in", "Defina a sua senha": "Set your password", "Para proteger a tesouraria, escolha uma senha forte antes de continuar. Ela é só sua.": "To protect the treasury, choose a strong password before continuing. It is yours alone.",
    "Senha actual": "Current password", "Senha nova": "New password", "Repetir a senha nova": "Repeat the new password", "Guardar e entrar": "Save and continue", "Guardar senha": "Save password",
    "Pelo menos {n} caracteres": "At least {n} characters", "Uma letra minúscula": "A lowercase letter", "Uma letra maiúscula": "An uppercase letter", "Um número": "A number", "Um símbolo (ex.: ! @ # ?)": "A symbol (e.g. ! @ # ?)",
    "As sessões abertas noutros aparelhos terminam depois da mudança.": "Sessions open on other devices end after the change.",
    "Para mudar a sua própria senha use “Alterar a minha senha” no menu da conta.": "To change your own password use “Change my password” in the account menu.",
    "Idioma / Language": "Language / Idioma",
    // ---- papéis e utilizadores
    "Administrador": "Administrator", "Administradores": "Administrators", "Tesoureiro": "Treasurer", "Tesoureiro (pode registar)": "Treasurer (can record)", "Só leitura": "Read only",
    "tudo, incluindo criar utilizadores": "everything, including creating users", "regista e altera valores": "records and edits amounts", "vê tudo, não altera": "sees everything, cannot edit",
    "Quem pode entrar na tesouraria e o registo de cada entrada. Só o administrador vê esta aba.": "Who can access the treasury and a log of each sign-in. Only the administrator sees this tab.",
    "Registar utilizador": "Register user", "Cria um acesso novo. Dê a senha à pessoa; na primeira entrada terá de escolher uma senha só sua.": "Creates a new account. Give the person the password; at first sign-in they must choose their own.",
    "Nome completo": "Full name", "Utilizador (para entrar)": "Username (to sign in)", "Papel": "Role", "Senha inicial (a pessoa muda-a na primeira entrada)": "Initial password (the person changes it at first sign-in)",
    "Contas ({n})": "Accounts ({n})", "Último acesso": "Last access", "Entradas hoje": "Sign-ins today", "Histórico de entradas": "Sign-in history", "Últimas {n} entradas no sistema": "Last {n} sign-ins",
    "Data e hora": "Date and time", "Quem entrou": "Who signed in", "Nunca entrou": "Never signed in", "Repor a senha desta pessoa": "Reset this person's password",
    "Senha nova (a pessoa terá de a mudar ao entrar)": "New password (the person must change it when signing in)", "Apagar utilizador": "Delete user", "(você)": "(you)",
    // ---- painel e gráficos
    "Painel de {n}": "Dashboard {n}", "Entradas, saídas e evolução do saldo ao longo do ano.": "Income, expenses and balance over the year.", "Exportar Excel completo": "Export full Excel",
    "Saldo disponível": "Available balance", "{n}% das entradas já gasto": "{n}% of income already spent", "Evolução do saldo": "Balance trend",
    "Saldo acumulado no fim de cada mês (entradas menos saídas)": "Cumulative balance at the end of each month (income minus expenses)", "Saldo acumulado": "Cumulative balance",
    "Entradas e saídas por mês": "Income and expenses by month", "Cotas, contribuições e ofertas contra as saídas": "Dues, contributions and offerings against expenses", "Entradas": "Income",
    "De onde vem o dinheiro": "Where the money comes from", "Composição das entradas de {n}": "Income breakdown {n}", "Entradas por tipo, mês a mês": "Income by type, month by month",
    "Barras empilhadas: cotas, contribuições e ofertas": "Stacked bars: dues, contributions and offerings", "Contrib.": "Contrib.", "Melhores cotas do ano": "Top dues of the year",
    "Ver classificação completa": "See full ranking", "Ver os valores em tabela": "View the values as a table", "Mês": "Month", "Saldo do mês": "Monthly balance", "Acumulado": "Cumulative",
    "Os gráficos mensais usam os registos com data. Totais de eventos escritos à mão entram nos cartões de cima, mas não num mês concreto.": "Monthly charts use dated records. Event totals typed by hand count in the cards above, but not in a specific month.",
    "Variação: +{n} MT": "Change: +{n} MT", "Variação: −{n} MT": "Change: −{n} MT", "Variação: {n} MT": "Change: {n} MT", "Entradas por tipo e por mês": "Income by type and month",
    "Ainda não há entradas em {n}.": "No income yet in {n}.", "Sem dados.": "No data.", "Ainda não há cotas registadas em {n}.": "No dues recorded in {n} yet.",
    // ---- membros
    "Registo de membros": "Member register", "Todos os membros da juventude, com contactos e situação das cotas de {n}.": "All youth members, with contacts and {n} dues status.",
    "Membros registados": "Registered members", "Jovens": "Youth", "{n} rapazes · {n} raparigas": "{n} boys · {n} girls", "Pagaram cota em {n}": "Paid dues in {n}", "{n}% dos membros": "{n}% of members",
    "Com telefone": "With phone", "{n} sem contacto": "{n} without contact", "Procurar por nome, telefone ou morada": "Search by name, phone or address", "Procurar membro": "Search member",
    "Filtrar": "Filter", "Todos": "All", "Sede": "Headquarters", "Bindura": "Bindura", "Liderança": "Leadership", "Sem cota em {n}": "No dues in {n}", "Nº": "No.", "Nome": "Name", "Sexo": "Sex",
    "Local": "Location", "Telefone": "Phone", "Idade": "Age", "Membro desde": "Member since", "Cotas {n}": "Dues {n}", "{n} anos": "{n} years", "Membro": "Member", "activo": "active",
    "{n} membros. Toque no nome para ver ou editar os dados.": "{n} members. Tap a name to view or edit.", "{n} membro. Toque no nome para ver ou editar os dados.": "{n} member. Tap a name to view or edit.",
    "{n} membros encontrados.": "{n} members found.", "{n} membros.": "{n} members.", "{n} membros neste filtro.": "{n} members in this filter.", "Não conta como jovem": "Not counted as youth",
    "Nenhum membro neste filtro. Use “Registar membro” para adicionar.": "No members in this filter. Use “Register member” to add.", "Nenhum membro neste filtro.": "No members in this filter.",
    "Registar membro": "Register member", "Editar membro": "Edit member", "Altere os dados e guarde.": "Change the details and save.",
    "Os campos com * são obrigatórios. O membro aparece logo nas cotas e na lista dos jovens.": "Fields with * are required. The member appears right away in dues and the youth list.",
    "Dados pessoais": "Personal details", "Nome completo *": "Full name *", "Data de nascimento": "Date of birth", "Morada / bairro": "Address / neighbourhood", "Na juventude": "In the youth group",
    "Cargo": "Role", "Bloco de Bindura": "Bindura Block", "Conta como jovem": "Counts as youth", "Entra na lista dos jovens e nas contagens": "Included in the youth list and counts",
    "Activo no Bloco de Bindura": "Active in the Bindura Block", "Só conta se o local for Bindura": "Only counts if the location is Bindura", "Notas": "Notes", "Observações (opcional)": "Remarks (optional)",
    "Outros dados (vindos do Excel)": "Other data (from Excel)", "Remover membro": "Remove member", "Guardar alterações": "Save changes", "Rapaz": "Boy", "Rapariga": "Girl", "Pai": "Father", "Mãe": "Mother",
    "Rapazes": "Boys", "Raparigas": "Girls", "Rapazes / Raparigas": "Boys / Girls",
    // ---- cargos
    "Responsável": "Leader", "Vice-Responsável": "Deputy leader", "Secretário(a)": "Secretary", "Vice-Secretário(a)": "Deputy secretary", "Membro Coordenador": "Coordinating member",
    "Membro Coordenador {n}": "Coordinating member {n}", "Família Conselheira": "Counselling family", "Responsável do Bloco": "Block leader", "Vice-Responsável do Bloco": "Block deputy leader",
    "Secretário(a) do Bloco": "Block secretary", "Vice-Secretário(a) do Bloco": "Block deputy secretary", "Membro Coordenador do Bloco": "Block coordinating member", "Conselheiro(a)": "Counsellor",
    "Coordenador(a)": "Coordinator", "Pastor(a)": "Pastor", "Diácono(isa)": "Deacon",
    // ---- cotas e classificação
    "Cotas de {n}": "Dues {n}", "Cota": "Dues", "Cota de {n}": "Dues {n}", "Total": "Total", "Saídas (cota)": "Expenses (dues)", "Disponível": "Available", "Disponível acumulado": "Cumulative available",
    "Toque num valor e escreva. Guarda sozinho, e os totais, a classificação e o resumo actualizam-se.": "Tap an amount and type. It saves automatically and totals, ranking and dashboard update.",
    "Valores de cota por membro e por mês.": "Dues per member and month.", "Classificação de cota": "Dues ranking", "Mensal": "Monthly", "Trimestral": "Quarterly", "Semestral": "Half-yearly", "Anual": "Annual",
    "Escolher período": "Choose period", "Período": "Period", "Tiraram cota": "Paid dues", "{n}.º": "{n}.", "{n}.º trimestre": "Q{n}", "{n}.º semestre": "H{n}",
    "Ano {n} · {n} membros com cota · total {n} MT": "Year {n} · {n} members with dues · total {n} MT", "Toque para alterar o valor": "Tap to change the amount",
    // ---- eventos, contribuições, ofertas, saídas
    "Conferências e eventos": "Conferences and events", "Campanhas de contribuição, como envelopes e contribuição dos líderes.": "Contribution campaigns, such as envelopes and leaders' contributions.",
    "Conferências, retiros, cultos especiais e outros eventos, com entradas e saídas de cada um.": "Conferences, retreats, special services and other events, with income and expenses for each.",
    "Nova contribuição": "New contribution", "Novo evento": "New event", "Criar contribuição": "Create contribution", "Criar evento": "Create event", "Criar conferência ou evento": "Create conference or event",
    "Contribuição": "Contribution", "Conferência": "Conference", "Retiro": "Retreat", "Culto especial": "Special service", "Outro evento": "Other event", "Evento": "Event", "Editar evento": "Edit event", "Apagar evento": "Delete event",
    "Meta": "Target", "Meta (MT)": "Target (MT)", "Meta em MT (opcional)": "Target in MT (optional)", "Meta {n} MT · falta {n} MT": "Target {n} MT · {n} MT to go", "Falta para a meta": "Left to target",
    "Data": "Date", "Data (opcional)": "Date (optional)", "Opcional": "Optional", "Entradas (MT)": "Income (MT)", "Saídas (MT)": "Expenses (MT)", "Saldo": "Balance", "Nota (opcional)": "Note (optional)",
    "Toque para registar entradas e saídas →": "Tap to record income and expenses →", "← Voltar": "← Back", "Entradas ({n}) · {n} MT": "Income ({n}) · {n} MT", "Saídas ({n}) · {n} MT": "Expenses ({n}) · {n} MT",
    "Nada registado.": "Nothing recorded.", "Nome de quem contribuiu": "Name of contributor", "Quem contribuiu": "Who contributed", "Guardar entrada": "Save income", "Nova entrada": "New income",
    "Ofertas de {n}": "Offerings {n}", "Total {n} MT em {n} registos.": "Total {n} MT in {n} records.", "Total {n} MT em {n} registo.": "Total {n} MT in {n} record.", "Registar oferta": "Record offering", "Nova oferta": "New offering",
    "Editar oferta": "Edit offering", "Guardar oferta": "Save offering", "Descrição": "Description", "Valor (MT)": "Amount (MT)", "Saídas de {n}": "Expenses {n}", "Total {n} MT": "Total {n} MT",
    "Da cota": "From dues", "Das ofertas": "From offerings", "De eventos": "From events", "Registar saída": "Record expense", "Nova saída": "New expense", "Editar saída": "Edit expense", "Guardar saída": "Save expense",
    "Sai de": "Paid from", "Editar entrada": "Edit income", "Apagar": "Delete", "✎ editar": "✎ edit", "Editar": "Edit", "Guardar": "Save", "Cancelar": "Cancel", "(sem descrição)": "(no description)",
    "Nenhuma oferta registada em {n}.": "No offerings recorded in {n}.", "Nenhuma saída registada em {n}.": "No expenses recorded in {n}.", "Sem data": "No date",
    // ---- actividades
    "Actividades realizadas": "Activities held", "Registe cada actividade feita pela juventude. As do mês entram sozinhas no relatório mensal.": "Record each youth activity. This month's go straight into the monthly report.",
    "Nova actividade": "New activity", "Actividades em {n}": "Activities in {n}", "Este mês": "This month", "Participações": "Attendance", "Média por actividade": "Average per activity",
    "Registar actividade": "Record activity", "Nome da actividade": "Activity name", "Tipo": "Type", "Participantes": "Participants", "O que foi feito (opcional)": "What was done (optional)",
    "Guardar actividade": "Save activity", "Lista de {n}": "List {n}", "Filtrar por mês": "Filter by month", "Todos os meses": "All months", "Editar actividade": "Edit activity",
    "Culto da juventude": "Youth service", "Estudo bíblico": "Bible study", "Ensaio / louvor": "Rehearsal / worship", "Evangelização": "Evangelism", "Visita": "Visit", "Reunião / comité": "Meeting / committee",
    "Confraternização": "Fellowship", "Desporto": "Sports", "Acção social": "Social action", "Outra actividade": "Other activity", "{n} actividade": "{n} activity", "{n} actividades": "{n} activities", "{n} participantes": "{n} participants",
    // ---- jovens, região, relatório
    "Estes dados entram no relatório mensal.": "This data goes into the monthly report.", "Constituição da liderança": "Leadership structure", "Escreva os nomes completos. Guarda sozinho ao sair do campo.": "Write full names. Saves automatically when you leave the field.",
    "Pastor da autonomia (assina o relatório)": "Autonomy pastor (signs the report)", "Total de jovens": "Total youth", "Activos de Bindura": "Active in Bindura", "Lista completa ({n})": "Full list ({n})",
    "PDF lista completa": "PDF full list", "PDF só jovens": "PDF youth only", "PDF só jovens ({n})": "PDF youth only ({n})", "Activo (Bindura)": "Active (Bindura)", "Participa activamente": "Actively participates", "+ Pessoa": "+ Person",
    "Ordem: líderes da Sede, líderes do Bloco, conselheiros, coordenador, pastores e diáconos, e depois os restantes. Toque no nome para o corrigir. A lista \"só jovens\" e as contagens não incluem conselheiros, coordenador, pastores nem diáconos. Os jovens desta lista também aparecem na tabela de cotas.": "Order: headquarters leaders, Block leaders, counsellors, coordinator, pastors and deacons, then the rest. Tap a name to correct it. The \"youth only\" list and counts exclude counsellors, coordinator, pastors and deacons. Youth in this list also appear in the dues table.",
    "Só na tabela de cotas (não contam como jovens)": "Only in the dues table (not counted as youth)", "Contar como jovem": "Count as youth",
    "Quotas enviadas por cada direcção e cumprimento das metas das conferências. Tudo editável.": "Dues sent by each board and conference target progress. All editable.", "Quotas por direcção em {n}": "Dues by board in {n}",
    "Toque num mês e escreva o valor enviado. Guarda sozinho. A % é a parte de cada direcção no total da região.": "Tap a month and type the amount sent. Saves automatically. % is each board's share of the region total.",
    "Direcção": "Board", "Nova direcção": "New board", "+ Direcção": "+ Board", "Ainda não há direcções.": "No boards yet.", "Total da região": "Region total", "Total do mês": "Month total", "Metas das conferências": "Conference targets",
    "Ainda não há conferências. Use “+ Conferência”.": "No conferences yet. Use “+ Conference”.", "+ Conferência": "+ Conference", "Nova conferência": "New conference", "Baixar PDF da região": "Download region PDF",
    "Classificação anual regional de quotas {n}": "Regional annual dues ranking {n}", "Ano {n} · total da região {n} MT": "Year {n} · region total {n} MT",
    "Escolha o mês, reveja os textos e baixe o relatório em Word para editar, ou em PDF.": "Choose the month, review the texts and download the report in Word to edit, or as PDF.",
    "Relatório de todo o ano de {n}: reveja os textos e baixe em Word para editar.": "Report for the whole year {n}: review the texts and download in Word to edit.",
    "Tipo de relatório": "Report type", "Mês do relatório": "Report month", "Mês da cota (mapa de cota e lista dos jovens)": "Dues month (dues map and youth list)", "Data do relatório (linha do pastor)": "Report date (pastor's line)",
    "Baixar em Word (editável)": "Download in Word (editable)", "Baixar em PDF": "Download as PDF", "Baixar relatório anual em Word": "Download annual report in Word", "Versículo final": "Closing verse",
    "Percentagem para a Nação (%)": "Percentage for the Nation (%)", "Valor da angariação online (MT) · faz a tabela da Autonomia da Cidade": "Online fundraising amount (MT) · builds the City Autonomy table", "Descrição da angariação": "Fundraising description",
    "A liderança, os números dos jovens, a lista dos jovens, o mapa de cota e as finanças entram sozinhos no relatório. Os textos abaixo guardam sozinhos e ficam guardados para este mês.": "Leadership, youth numbers, the youth list, the dues map and finances go into the report automatically. The texts below save automatically for this month.",
    "Faltam nomes da liderança ou do pastor. Preencha-os na aba": "Leadership or pastor names are missing. Fill them in on the tab", "· um por linha": "· one per line", "· uma por linha": "· one per line", "· vêm das abas": "· come from the tabs",
    "{n}. Introdução": "{n}. Introduction", "{n}. Texto sobre a liderança": "{n}. Leadership text", "{n}. Actividades realizadas": "{n}. Activities held", "{n}. Texto das finanças": "{n}. Finance text",
    "{n}. Para onde foram os valores": "{n}. Where the money went", "{n}. Expectativas": "{n}. Expectations", "{n}. Desafios": "{n}. Challenges", "{n}. Conclusão": "{n}. Conclusion", "{n}. Trabalho da conferência": "{n}. Conference work",
    "{n}. Outras actividades (opcional, entram depois das registadas se as escrever)": "{n}. Other activities (optional, added after the recorded ones)", "Nação {n}% / Disponível": "Nation {n}% / Available",
    "· opcional · aparece no relatório como “Conferência da Juventude”, deixe vazio se não houver": "· optional · appears in the report as “Youth Conference”, leave empty if none", "Relatório mensal": "Monthly report", "Relatório anual em Word": "Annual report in Word",
    // ---- relatórios e dados
    "Relatórios em PDF": "PDF reports", "Escolha o relatório e toque em “Baixar PDF”. Os valores são os de {n}.": "Choose a report and tap “Download PDF”. Amounts are for {n}.",
    "O painel como aparece no site: totais, gráfico de cotas e saídas por mês, melhores cotas e eventos.": "The dashboard as shown on the site: totals, dues and expenses chart by month, top dues and events.",
    "Baixar PDF do painel": "Download dashboard PDF", "Relatório completo do mês com o timbre da igreja, liderança, jovens, mapa de cota, finanças, expectativas, conclusão e assinatura do pastor.": "Full monthly report with church letterhead, leadership, youth, dues map, finances, expectations, conclusion and the pastor's signature.",
    "Abrir relatório mensal (Word ou PDF)": "Open monthly report (Word or PDF)", "Listas de nomes": "Name lists", "Lista completa (com conselheiros, coordenador, pastores e diáconos) ou só jovens, com cargo, sexo e local.": "Full list (with counsellors, coordinator, pastors and deacons) or youth only, with role, sex and location.",
    "Classificação de um período": "Ranking for a period", "Baixar PDF da classificação": "Download ranking PDF", "Conferências e contribuições": "Conferences and contributions", "Todas as conferências e eventos": "All conferences and events",
    "Todos (conferências e contribuições)": "All (conferences and contributions)", "Baixar PDF": "Download PDF", "Excel: todos os dados": "Excel: all data",
    "Um ficheiro Excel com resumo mensal, membros, cotas de {n}, movimentos, eventos e actividades. A importação aceita o mesmo ficheiro (ou o modelo) e actualiza membros, cotas, movimentos e actividades.": "An Excel file with monthly summary, members, {n} dues, transactions, events and activities. Import accepts the same file (or the template) and updates members, dues, transactions and activities.",
    "Cópia de segurança dos dados": "Data backup", "Baixar cópia (.json)": "Download backup (.json)", "Importar cópia": "Import backup", "Importar cópia para o MySQL": "Import backup into MySQL", "Enviar dados deste navegador para o MySQL": "Send this browser's data to MySQL",
    "Os dados ficam guardados na base de dados MySQL e também neste navegador. Sem ligação, as alterações ficam no aparelho e seguem para o MySQL quando a ligação voltar. Pode ainda baixar uma cópia (.json) para guardar à parte.": "Data is stored in the MySQL database and also in this browser. Without a connection, changes stay on the device and go to MySQL when the connection returns. You can also download a backup (.json).",
    "Baixe uma cópia (.json) para guardar à parte, ou para a importar noutro telemóvel ou computador.": "Download a backup (.json) to keep separately, or to import on another phone or computer.",
    "Enviar por email": "Send by email", "O site não consegue enviar emails sozinho. Depois de baixar o PDF, anexe-o a um email para:": "The site cannot send emails by itself. After downloading the PDF, attach it to an email to:",
    "Copiar email": "Copy email", "No iPhone, ao baixar abre-se a folha de partilha: escolha “Mail” ou “Gmail” e envie directamente.": "On iPhone, downloading opens the share sheet: choose “Mail” or “Gmail” and send directly.",
    // ---- Excel e PDF
    "Exportar Excel": "Export Excel", "Importar Excel": "Import Excel", "PDF": "PDF", "Modelo": "Template", "Baixar um ficheiro modelo com as colunas certas": "Download a template file with the right columns",
    "Todos os dados": "All data", "Movimentos {n}": "Transactions {n}", "Eventos": "Events", "Actividades {n}": "Activities {n}", "Acessos": "Sign-ins", "Ofertas {n}": "Offerings {n}", "Saídas {n}": "Expenses {n}",
    "Contribuições {n}": "Contributions {n}", "Painel {n}": "Dashboard {n}", "Sem dados": "No data", "Total de entradas": "Total income", "Nº de entradas": "No. of sign-ins", "Resultado": "Result",
    "Morada": "Address", "Evento: {n}": "Event: {n}", "Ofertas": "Offerings", "Oferta": "Offering", "Saída": "Expense", "Sim": "Yes", "Não": "No", "Nota": "Note", "Saldo (MT)": "Balance (MT)",
    "Data de entrada": "Member since", "Entrou": "Signed in",
    // ---- meses
    "Janeiro": "January", "Fevereiro": "February", "Março": "March", "Abril": "April", "Maio": "May", "Junho": "June", "Julho": "July", "Agosto": "August", "Setembro": "September", "Outubro": "October", "Novembro": "November", "Dezembro": "December",
    "Jan": "Jan", "Fev": "Feb", "Mar": "Mar", "Abr": "Apr", "Mai": "May", "Jun": "Jun", "Jul": "Jul", "Ago": "Aug", "Set": "Sep", "Out": "Oct", "Nov": "Nov", "Dez": "Dec",
    // ---- mensagens (avisos, erros, confirmações)
    "A preparar o PDF…": "Preparing PDF…", "A preparar o Word…": "Preparing Word…", "A preparar…": "Preparing…", "A senha actual está errada.": "The current password is wrong.",
    "A senha nova tem de ser diferente da actual.": "The new password must be different from the current one.", "A usar a soma dos registos": "Using the sum of records", "Actividade actualizada": "Activity updated",
    "Actividade apagada": "Activity deleted", "Actividade guardada": "Activity saved", "Ainda não foi baixada nenhuma cópia neste aparelho.": "No backup has been downloaded on this device yet.", "Alterações guardadas": "Changes saved",
    "Apagado": "Deleted", "As duas senhas novas não são iguais.": "The two new passwords do not match.", "Conferência actualizada": "Conference updated", "Conferência apagada": "Conference deleted", "Conferência criada": "Conference created",
    "Confirmar (apaga também os registos)": "Confirm (also deletes the records)", "Confirmar apagar": "Confirm delete", "Confirmar remoção (apaga as cotas)": "Confirm removal (deletes dues)", "Confirmar: apagar os textos deste mês": "Confirm: delete this month's texts",
    "Cota guardada · classificação actualizada": "Dues saved · ranking updated", "Crie primeiro uma contribuição ou evento.": "Create a contribution or event first.", "Cópia baixada": "Backup downloaded", "Cópia importada": "Backup imported",
    "Dados gravados na base de dados": "Data saved to the database", "Direcção acrescentada": "Board added", "Email copiado": "Email copied", "Escolha a data.": "Choose the date.", "Escreva a senha actual.": "Enter the current password.",
    "Escreva o nome da actividade.": "Enter the activity name.", "Escreva o nome do evento.": "Enter the event name.", "Escreva o nome do membro.": "Enter the member's name.", "Escreva o nome.": "Enter the name.", "Escreva a descrição.": "Enter the description.",
    "Escreva o utilizador (letras e números, sem espaços).": "Enter the username (letters and numbers, no spaces).", "Escreva o utilizador e a senha.": "Enter the username and password.", "Escreva um valor maior que zero.": "Enter an amount greater than zero.",
    "Evento actualizado": "Event updated", "Evento apagado": "Event deleted", "Evento criado": "Event created", "Contribuição criada": "Contribution created", "Excel pronto": "Excel ready", "Ficheiro de cópia inválido.": "Invalid backup file.", "Guardado": "Saved",
    "Já existe um utilizador com esse nome.": "A user with that name already exists.", "Liderança guardada": "Leadership saved", "Membro actualizado": "Member updated", "Membro registado": "Member registered", "Membro removido": "Member removed",
    "Modelo baixado: preencha e importe": "Template downloaded: fill in and import", "Nome guardado": "Name saved", "Não foi possível apagar.": "Could not delete.", "Não foi possível guardar.": "Could not save.", "Não foi possível repor.": "Could not reset.",
    "Não é possível baixar ficheiros nesta vista.": "Files cannot be downloaded in this view.", "O nome não pode ficar vazio.": "The name cannot be empty.", "Quota guardada": "Dues saved", "Seleccione e copie o email": "Select and copy the email",
    "Senha alterada": "Password changed", "Senha definida. Bem-vindo!": "Password set. Welcome!", "Tem de ficar pelo menos um administrador.": "There must be at least one administrator.", "Textos de modelo repostos": "Template texts restored",
    "Utilizador actualizado": "User updated", "Utilizador apagado": "User deleted", "Utilizador ou senha errados.": "Wrong username or password.", "Valor guardado": "Amount saved", "Saída guardada": "Expense saved", "Entrada guardada": "Income saved", "Oferta guardada": "Offering saved",
    "Jovem adicionado": "Youth added", "Actualizado": "Updated", "Excel": "Excel", "Não foi possível criar o PDF.": "Could not create the PDF.", "Não foi possível criar o Excel.": "Could not create the Excel file.",
    "Não foi possível carregar o Excel. Verifique a ligação.": "Could not load Excel. Check the connection.", "Não foi possível carregar o gerador de PDF. Verifique a ligação.": "Could not load the PDF generator. Check the connection.",
    "Não foi possível guardar. Verifique a ligação.": "Could not save. Check the connection.", "Não foi possível guardar. Verifique a ligação e tente outra vez.": "Could not save. Check the connection and try again.",
    "Sem permissão para alterar.": "No permission to edit.", "Sem permissão para gravar.": "No permission to save.", "Não foi possível entrar.": "Could not sign in.", "Sem ligação ao servidor. Tente outra vez.": "No connection to the server. Try again.",
    "A sessão terminou (a conta saiu ou entrou noutro aparelho). Entre outra vez.": "The session ended (the account signed out or signed in on another device). Sign in again.",
    "Esta conta já está ligada noutro aparelho. Saia nesse aparelho primeiro (ou espere cerca de 1 minuto depois de o fechar).": "This account is already signed in on another device. Sign out there first (or wait about 1 minute after closing it).",
    "Demasiadas tentativas. Espere 15 minutos.": "Too many attempts. Wait 15 minutes.", "Defina uma senha nova antes de continuar.": "Set a new password before continuing.",
    "A base de dados está desligada e este utilizador ainda não entrou neste aparelho. Entre num aparelho que já tenha usado, ou ligue a base de dados.": "The database is off and this user has not signed in on this device yet. Use a device you have used before, or turn on the database.",
    "Não foi possível alterar a senha.": "Could not change the password.", "Não foi possível guardar a senha.": "Could not save the password.", "Há uma versão nova da app.": "A new version of the app is available.", "Actualizar": "Update",
    "Nada para gravar.": "Nothing to save.", "Utilizador só de leitura.": "Read-only user.", "Só o administrador pode gerir utilizadores.": "Only the administrator can manage users.", "Não pode apagar o seu próprio utilizador.": "You cannot delete your own user.",
    "Não pode mudar o seu próprio papel.": "You cannot change your own role.", "A senha deve ter pelo menos 6 caracteres.": "The password must have at least 6 characters.", "Escreva a senha.": "Enter the password.",
    "Continuar?": "Continue?", "Importar de": "Import from", "Confirmar?": "Confirm?",
    "Nada de novo: {n} linhas já existiam ou estavam incompletas.": "Nothing new: {n} rows already existed or were incomplete.", "Não encontrei dados nas colunas esperadas. Use o modelo.": "No data found. Use the template.",
    "Está em modo de leitura. Só os responsáveis com permissão de edição podem registar valores.": "You are in read-only mode. Only people with edit permission can record amounts.",
    "Este navegador ainda tem dados guardados da versão antiga (só neste aparelho).": "This browser still has data saved by the old version (only on this device).", "Enviar para a base de dados MySQL": "Send to the MySQL database", "Ignorar": "Ignore",
    "Ainda não baixou nenhuma cópia de segurança neste aparelho.": "You have not downloaded a backup on this device yet.", "Baixar cópia agora": "Download backup now",
    "Ainda não há contribuições. Preencha o formulário acima para criar o primeiro.": "No contributions yet. Fill in the form above to create the first one.", "Ainda não há contribuições.": "No contributions yet.",
    "Ainda não há conferências ou eventos. Preencha o formulário acima para criar o primeiro.": "No conferences or events yet. Fill in the form above to create the first one.", "Ainda não há conferências ou eventos.": "No conferences or events yet.",
    "Ainda não há actividades registadas neste ano.": "No activities recorded this year yet.", "Ainda não há actividades registadas neste mês.": "No activities recorded this month yet.", "Ainda não há eventos registados.": "No events recorded yet.",
    "Nenhuma actividade ou evento registado neste mês. Será usado o texto abaixo.": "No activity or event recorded this month. The text below will be used.", "Membro adicionado": "Member added", "Nome de quem": "Name of",
    "A última cópia de segurança foi há {n} dias.": "The last backup was {n} days ago.",
    "Membros da liderança ({n})": "Leadership members ({n})", "Responsável (só visualização)": "Leader (view only)", "Vice-Responsável (só visualização)": "Deputy leader (view only)", "Secretário(a) (só visualização)": "Secretary (view only)", "Vice-Secretário(a) (só visualização)": "Deputy secretary (view only)", "Conselheiro(a) (só visualização)": "Counsellor (view only)", "Pastor(a) (só visualização)": "Pastor (view only)", "só visualização": "view only", "Responsável · Vice-Responsável · Secretário(a) · Vice-Secretário(a) · Conselheiro(a) · Pastor(a)": "Leader · Deputy leader · Secretary · Deputy secretary · Counsellor · Pastor", "Utilizador só de visualização.": "View-only user.", "+ Acrescentar à liderança…": "+ Add to leadership…", "Acrescentar à liderança": "Add to leadership", "Retirar": "Remove", "Retirar da liderança (continua em Membros)": "Remove from leadership (stays in Members)",
    "Acrescentado à liderança": "Added to leadership", "Retirado da liderança (continua em Membros)": "Removed from leadership (stays in Members)", "Faz parte da liderança": "Part of the leadership", "Aparece na página Liderança": "Shown on the Leadership page",
    "Quem faz parte da liderança da juventude. Os restantes estão em Membros. Estes dados entram no relatório mensal.": "Who is part of the youth leadership. Everyone else is in Members. This data goes into the monthly report.",
    "Escreva o cargo de cada pessoa (há sugestões). Quem for retirado continua em Membros e nas Cotas.": "Type each person's role (suggestions available). Anyone removed stays in Members and Dues.",
    "Ainda ninguém na liderança. Use “+ Acrescentar à liderança”.": "Nobody in the leadership yet. Use “+ Add to leadership”.",
    "✎ Editar na tabela": "✎ Edit in table", "✓ Terminar edição": "✓ Finish editing", "Nome e cargo": "Name and role", "Cargo": "Role",
    "Deslize dentro da tabela para ver todos os meses e membros": "Scroll inside the table to see all months and members", "Arraste com o rato ou use a roda": "Drag with the mouse or use the wheel",
    "Logótipo": "Logo", "Logótipo actual": "Current logo", "Escolher imagem": "Choose image", "Repor original": "Restore original", "Logótipo actualizado": "Logo updated", "Logótipo original reposto": "Original logo restored",
    "Aparece no cabeçalho, na barra lateral, no ecrã de entrada e no ícone do separador, em todos os aparelhos.": "Shown in the header, sidebar, sign-in screen and tab icon, on every device.",
    "Cor do sistema": "System colour", "Azul institucional": "Institutional blue", "Verde claro": "Light green", "Azul": "Blue", "Vinho": "Wine", "Verde escuro (antigo)": "Dark green (old)",
    "Escolha uma imagem (PNG, JPG ou SVG).": "Choose an image (PNG, JPG or SVG).", "Não foi possível guardar o logótipo.": "Could not save the logo.",
    "Procurar na tabela…": "Search the table…", "Limpar": "Clear", "Procurar na tabela": "Search the table",
    "Ver detalhes": "View details", "Detalhes": "Details", "✎ Editar": "✎ Edit", "⧉ Duplicar": "⧉ Duplicate", "Abrir campanha": "Open campaign", "Abrir evento": "Open event", "Entrada de contribuição": "Contribution entry",
    "Campanha": "Campaign", "Período": "Period", "Últimas entradas ({n})": "Latest entries ({n})", "Ainda sem entradas.": "No entries yet.", "{n}% da meta · falta {n} MT": "{n}% of target · {n} MT to go", "{n}% da meta · meta atingida": "{n}% of target · target reached",
    "Posição": "Position", "Meses pagos": "Months paid", "Nascimento": "Birth", "✎ Editar dados": "✎ Edit details", "☎ Ligar": "☎ Call", "Ver nas cotas": "View in dues", "Remover": "Remove", "não conta como jovem": "not counted as youth",
    "Total de cotas {n}": "Total dues {n}", "Saídas da cota": "Dues expenses", "depois das saídas": "after expenses", "Pagaram cota": "Paid dues", "de {n}": "of {n}", "Média por quem pagou": "Average per payer",
    "{n}% do total": "{n}% of total", "ano completo": "full year", "Cotas recebidas e saídas por mês": "Dues received and expenses by month", "Toque numa barra para ver os valores": "Tap a bar to see the values",
    "Com cota ({n})": "With dues ({n})", "Sem cota ({n})": "Without dues ({n})", "Todos ({n})": "All ({n})", "Ordenar": "Sort", "Maior total primeiro": "Highest total first", "Nome (A–Z)": "Name (A–Z)", "Ordem de registo": "Registration order",
    "Procurar membro…": "Search member…", "Mostrar todos": "Show all", "Toque num valor e escreva: guarda sozinho e os totais actualizam-se.": "Tap an amount and type: it saves automatically and totals update.",
    "Campanhas": "Campaigns", "Recebido": "Received", "Meta total": "Total target", "sem metas definidas": "no targets set", "Todas": "All", "Em curso": "In progress", "Meta atingida": "Target reached", "Sem meta": "No target",
"⇅ Ordenar por…": "⇅ Sort by…", "Ordenar por": "Sort by", "⇅ Ordem de registo": "⇅ Registration order", "Maior → menor total": "Highest → lowest total", "Menor → maior total": "Lowest → highest total", "Nome (Z–A)": "Name (Z–A)", "Maior → menor cota": "Highest → lowest dues", "Menor → maior cota": "Lowest → highest dues", "Mais novos primeiro": "Youngest first", "Mais velhos primeiro": "Oldest first", "Membros mais recentes": "Newest members", "Membros mais antigos": "Oldest members", "Mais antigas": "Oldest", "Maior → menor recebido": "Highest → lowest received", "Menor → maior recebido": "Lowest → highest received", "Maior → menor cumprimento": "Highest → lowest progress", "Menor → maior cumprimento": "Lowest → highest progress", "Meta da conferência": "Conference target", "Recebido (separador Conferências)": "Received (Conferences tab)", "Cumprimento": "Progress", "Metas das direcções": "Directions targets", "Contribuído pelas direcções": "Contributed by directions", "Escreva a meta e o valor contribuído de cada direcção (guarda sozinho) ou importe o Excel das metas.": "Enter each direction’s target and contributed amount (saves automatically) or import the targets Excel.", "Ainda não foram escritas metas por direcção.": "No targets per direction yet.",
    "O meu perfil": "My profile", "Privilégios": "Privileges", "Registar e alterar dados": "Record and edit data", "Ver a lista de utilizadores": "View the users list", "Redefinir senha": "Reset password", "Último acesso": "Last access", "Entradas no sistema": "Logins", "O que pode fazer": "What you can do", "Registar e alterar dados da tesouraria": "Record and edit treasury data", "Ver todos os dados da tesouraria (sem alterar)": "View all treasury data (read-only)", "Baixar relatórios em Excel, PDF e Word": "Download reports in Excel, PDF and Word", "Alterar a própria senha": "Change your own password", "Alterar a minha senha": "Change my password", "Os seus dados de acesso. Para mudar o papel, os privilégios ou redefinir a senha fale com o administrador.": "Your access details. To change your role, privileges or reset your password, contact the administrator.", "Quem pode entrar na tesouraria (só visualização).": "Who can sign in to the treasury (view only).", "Quem pode entrar na tesouraria, o papel e os privilégios de cada pessoa. Só o administrador altera e repõe senhas.": "Who can sign in, each person’s role and privileges. Only the administrator can change them and reset passwords.", "Senha nova": "New password", "Repetir a senha nova": "Repeat the new password", "(já incluído no papel)": "(already included in the role)", "Para redefinir a senha desta pessoa use o botão “Redefinir senha” na tabela.": "To reset this person’s password use the “Reset password” button in the table.",
    "Papel e privilégios": "Role and privileges", "Privilégios extra": "Extra privileges", "Já incluído no papel escolhido": "Already included in the chosen role", "atribuído": "granted", "Procurar utilizador…": "Search user…", "Todos os papéis": "All roles", "Nenhum utilizador encontrado.": "No user found.", "O que cada papel pode fazer": "What each role can do", "+ Registar utilizador": "+ Register user", "Desbloquear conta": "Unlock account", "conta bloqueada": "account locked", "Desbloquear": "Unlock", "Nunca entrou": "Never signed in", "Entradas": "Logins",
    "Autonomia das Águias de Pemba": "Águias de Pemba Autonomy", "Direcção da Juventude": "Youth Directorate", "Direcção da Juventude · Tesouraria": "Youth Directorate · Treasury", "Autonomia das Águias de Pemba · Direcção da Juventude": "Águias de Pemba Autonomy · Youth Directorate",
        "Mais recentes": "Most recent", "Maior recebido": "Highest received", "Maior cumprimento": "Highest progress", "Procurar contribuição…": "Search contribution…", "Procurar evento…": "Search event…",
    "Nenhum resultado com estes filtros.": "No results with these filters.", "Criar contribuição": "Create contribution", "Contribuintes": "Contributors", "ainda sem entradas": "no entries yet",
    "Procurar por descrição, nota ou data…": "Search by description, note or date…", "Definições": "Settings", "Preferências deste aparelho.": "Preferences for this device.", "Tabelas": "Tables",
    "Linhas por página em cada tabela": "Rows per page in each table", "{n} linhas": "{n} rows", "Definições guardadas": "Settings saved", "Idioma": "Language", "Português": "Português",
    "As tabelas mostram este número de linhas por página, com “Anterior”, as páginas e “Próximo”.": "Tables show this number of rows per page, with “Previous”, the pages and “Next”.",
    "‹ Anterior": "‹ Previous", "Próximo ›": "Next ›", "Página anterior": "Previous page", "Página seguinte": "Next page", "Páginas da tabela": "Table pages", "Página {n}": "Page {n}",
    "Conferência / evento": "Conference / event", "Saídas (MZN)": "Expenses (MZN)", "Cota (MZN)": "Dues (MZN)", "% do total": "% of total", "Comparação": "Comparison", "sem meta": "no target", "Pos.": "Pos.",
    "Toque numa linha para abrir e registar entradas e saídas.": "Tap a row to open it and record income and expenses.", "Toque numa linha para ver o detalhe.": "Tap a row to see the details.",
    "Total ({n} actividades)": "Total ({n} activities)", "Total ({n} actividade)": "Total ({n} activity)", "Total ({n})": "Total ({n})",
    "Saltar para o conteúdo": "Skip to content", "Total ({n} registos)": "Total ({n} records)", "Total ({n} registo)": "Total ({n} record)", "Acções": "Actions", "Origem": "Source", "Valor (MZN)": "Amount (MZN)",
    "Recebido (MZN)": "Received (MZN)", "Saída (MZN)": "Expense (MZN)", "Gastos (MZN)": "Spending (MZN)", "Saldo (MZN)": "Balance (MZN)", "Meta (MZN)": "Target (MZN)", "Em falta (MZN)": "Remaining (MZN)", "Cumprimento": "Progress",
    "Origem do valor": "Source of funds", "Data / período": "Date / period", "Actividade": "Activity", "Observação": "Remarks", "% da região": "% of region", "Posição": "Position", "Conferências - saldo": "Conferences - balance",
    "Região de Pemba {n}": "Pemba Region {n}", "Liderança": "Leadership", "Pastor da autonomia": "Autonomy pastor", "Não encontrei nenhuma tabela com cabeçalhos conhecidos no ficheiro.": "No table with known headers was found in the file.",
    "As tabelas não têm linhas com dados.": "The tables have no data rows.", "Nada de novo: {n} linhas já existiam.": "Nothing new: {n} rows already existed.",
    "Sem ligação à base de dados. Registe ou altere utilizadores quando ela estiver ligada.": "No connection to the database. Register or edit users when it is on.",
    "{n} membro sem cota neste período.": "{n} member without dues in this period.", "{n} membros sem cota neste período.": "{n} members without dues in this period.",
    "{n} jovem ainda não tem o sexo marcado. Escolha Rapaz ou Rapariga na lista para as contas ficarem certas.": "{n} youth member has no sex set yet. Choose Boy or Girl in the list so the counts are right.",
    "{n} jovens ainda não têm o sexo marcado. Escolha Rapaz ou Rapariga na lista para as contas ficarem certas.": "{n} youth members have no sex set yet. Choose Boy or Girl in the list so the counts are right.", "Saldo final": "Final balance", "Valores": "Amounts", "Mapa de cota": "Dues map",
  };
  ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].forEach(m => { EN["{n}. Actividades e eventos registados em " + m] = "{n}. Activities and events recorded in " + EN[m]; });
  EN["{n}. Actividades e eventos registados em {n}"] = "{n}. Activities and events recorded in {n}";
  // datas e meses combinados com números ("12 Fev 2026", "Março ({n})", "Março de {n}")
  const MPT = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const MAB = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  MPT.forEach(m => { const e = EN[m]; EN[m + " ({n})"] = e + " ({n})"; EN[m + " {n}"] = e + " {n}"; EN[m + " de {n}"] = e + " {n}"; EN["Cota de " + m] = "Dues " + e;
    EN[m + " de {n} · {n} membros com cota · total {n} MT"] = e + " {n} · {n} members with dues · total {n} MT"; EN["{n} de " + m + " de {n}"] = e + " {n}, {n}"; });
  MAB.forEach(m => { const e = EN[m]; EN["{n} " + m + " {n}"] = "{n} " + e + " {n}"; EN["{n} " + m + " {n}, {n}"] = "{n} " + e + " {n}, {n}"; EN[m + ": {n} MT"] = e + ": {n} MT"; });
  ["{n}.º trimestre de {n} · {n} membros com cota · total {n} MT|Q{n} {n} · {n} members with dues · total {n} MT", "{n}.º semestre de {n} · {n} membros com cota · total {n} MT|H{n} {n} · {n} members with dues · total {n} MT",
    "{n}.º trimestre (Jan–Mar)|Q{n} (Jan–Mar)", "{n}.º trimestre (Abr–Jun)|Q{n} (Apr–Jun)", "{n}.º trimestre (Jul–Set)|Q{n} (Jul–Sep)", "{n}.º trimestre (Out–Dez)|Q{n} (Oct–Dec)",
    "{n}.º semestre (Jan–Jun)|H{n} (Jan–Jun)", "{n}.º semestre (Jul–Dez)|H{n} (Jul–Dec)", "Anual {n}|Annual {n}", "Ano {n}|Year {n}", "Cotas: {n} MT|Dues: {n} MT", "Contribuições: {n} MT|Contributions: {n} MT",
    "Ofertas: {n} MT|Offerings: {n} MT", "Entradas: {n} MT|Income: {n} MT", "Saídas: {n} MT|Expenses: {n} MT", "Saldo: {n} MT|Balance: {n} MT", "Total: {n} MT|Total: {n} MT", "Saldo acumulado: {n} MT|Cumulative balance: {n} MT",
    "Cotas {n} MT, Contribuições {n} MT, Ofertas {n} MT|Dues {n} MT, Contributions {n} MT, Offerings {n} MT", "{n} rapazes e {n} raparigas|{n} boys and {n} girls", "{n} membros|{n} members"].forEach(p => { const [a, b] = p.split("|"); EN[a] = b; });

  // textos com nomes de pessoas ou eventos
  const PAD = [
    [/^(.+): hierarquia inversa$/, m => (trCore(m[1].charAt(0).toUpperCase() + m[1].slice(1)) ?? m[1]) + ": reverse hierarchy"], [/^(.+): hierarquia$/, m => (trCore(m[1].charAt(0).toUpperCase() + m[1].slice(1)) ?? m[1]) + ": hierarchy"], [/^(.+): maior → menor$/, m => (trCore(m[1].charAt(0).toUpperCase() + m[1].slice(1)) ?? m[1]) + ": highest → lowest"], [/^(.+): menor → maior$/, m => (trCore(m[1].charAt(0).toUpperCase() + m[1].slice(1)) ?? m[1]) + ": lowest → highest"],
    [/^\+ (.+)$/, m => "+ " + (trCore(m[1]) ?? m[1])],
    [/^(.+): todos$/, m => { const t = trCore(m[1].charAt(0).toUpperCase() + m[1].slice(1)) ?? m[1]; return t + ": all"; }],
    [/^Filtrar por (.+)$/, m => "Filter by " + (trCore(m[1]) ?? m[1])],
    [/^Bem-vindo, (.+)$/, m => "Welcome, " + m[1]], [/^Conta de (.+)$/, m => m[1] + "'s account"], [/^Sessão iniciada: (.+)$/, m => "Signed in: " + m[1]], [/^(.+) \(você\)$/, m => m[1] + " (you)"],
    [/^Editar (.+)$/, m => "Edit " + m[1]], [/^Cargo de (.+)$/, m => "Role of " + m[1]], [/^Sexo de (.+)$/, m => "Sex of " + m[1]], [/^Local de (.+)$/, m => "Location of " + m[1]],
    [/^(\d+) pessoas? ligadas?: (.+)$/, m => m[1] + (m[1] === "1" ? " person" : " people") + " online: " + m[2]], [/^Evento: (.+)$/, m => "Event: " + m[1]], [/^Contribuição: (.+)$/, m => "Contribution: " + m[1]],
    [/^Conferência: (.+)$/, m => "Conference: " + m[1]], [/^Retiro: (.+)$/, m => "Retreat: " + m[1]], [/^Utilizador: (.+)$/, m => "Username: " + m[1]], [/^Utilizador criado: (.+)$/, m => "User created: " + m[1]],
    [/^PDF pronto: (.+)$/, m => "PDF ready: " + m[1]], [/^Word pronto: (.+)$/, m => "Word ready: " + m[1]], [/^Importado: (.+)$/, m => "Imported: " + trLista(m[1])],
    [/^Não foi possível enviar uma alteração: (.+)$/, m => "Could not send a change: " + tr(m[1])], [/^Última cópia baixada: (.+)$/, m => "Last backup downloaded: " + tr(m[1])],
    [/^Não foi possível ler o ficheiro: ?(.*)$/, m => "Could not read the file: " + m[1]], [/^A senha precisa de: (.+)\.$/, m => "The password needs: " + m[1].split(", ").map(x => SENHA[x] || x).join(", ") + "."],
    [/^Ex\.: (.+)$/, m => "E.g.: " + m[1]], [/^(.+) (Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)$/, m => m[1] + " " + EN[m[2]]],
    [/^Classificação anual agora: (.*)$/, m => "Annual ranking now: " + m[1]],
    [/^Já existe um membro chamado (.+)\. Registar outro com o mesmo nome\?$/, m => "A member called " + m[1] + " already exists. Register another with the same name?"],
  ];
  const SENHA = { "pelo menos 8 caracteres": "at least 8 characters", "uma letra minúscula": "a lowercase letter", "uma letra maiúscula": "an uppercase letter", "um número": "a number", "um símbolo (ex.: ! @ # ?)": "a symbol (e.g. ! @ # ?)",
    "não conter o nome de utilizador": "not contain the username", "não ser uma senha conhecida": "not be a common password", "no máximo 128 caracteres": "at most 128 characters" };
  const PARTES = { "membros novos": "new members", "membros actualizados": "members updated", "valores de cota": "dues amounts", "movimentos": "transactions", "actividades": "activities", "eventos novos": "new events",
    "ofertas": "offerings", "saídas": "expenses", "contribuições": "contributions", "entradas de contribuições": "contribution entries", "conferências": "conferences", "quotas da região": "region dues", "cargos da liderança": "leadership roles" };
  function trLista(s) { return s.split(", ").map(p => { const m = p.match(/^(\d+) (.+)$/); return m && PARTES[m[2]] ? m[1] + " " + PARTES[m[2]] : p; }).join(", "); }

  let lang = "pt"; try { lang = localStorage.getItem("tes-lang") === "en" ? "en" : "pt"; } catch (e) {}
  const NUM = /\d+(?:[ .,:]\d+)*/g;
  function trCore(core) {
    if (EN[core] != null) return EN[core];
    const nums = []; const key = core.replace(NUM, x => { nums.push(x); return "{n}"; });
    if (EN[key] != null) { let i = 0; return EN[key].replace(/\{n\}/g, () => nums[i++] ?? ""); }
    for (const [re, f] of PAD) { const m = core.match(re); if (m) return f(m); }
    for (const sep of [" · ", " — ", ": "]) if (core.includes(sep)) { const ps = core.split(sep), t = ps.map(p => trCore(p.trim()) ?? p); if (t.some((x, i) => x !== ps[i])) return t.join(sep); }
    return null;
  }
  function tr(s) {
    if (lang !== "en" || s == null) return s; s = String(s); const core = s.replace(/\s+/g, " ").trim(); if (!core) return s;
    const t = trCore(core); if (t == null) return s;
    return s.match(/^\s*/)[0] + t + s.match(/\s*$/)[0];
  }
  window.TES_TR = s => (lang === "en" ? tr(s) : s);
  window.TES_LANG = () => lang;

  // ---- aplicar ao ecrã
  const ORIG = new WeakMap(), FEITO = new WeakMap(), ATTR = ["placeholder", "title", "aria-label"];
  const salta = el => !el || el.closest("script,style,textarea,[contenteditable],[data-notr]");
  function trTexto(n) {
    if (salta(n.parentElement)) return;
    if (FEITO.get(n) !== n.nodeValue) ORIG.set(n, n.nodeValue); // valor novo escrito pela app (português)
    const pt = ORIG.get(n), novo = lang === "en" ? tr(pt) : pt;
    if (novo !== n.nodeValue) n.nodeValue = novo;
    FEITO.set(n, n.nodeValue);
  }
  function trAttrs(el) {
    if (salta(el)) return; let o = ORIG.get(el); if (!o) { o = {}; ORIG.set(el, o); }
    for (const a of ATTR) { if (!el.hasAttribute(a)) continue; const v = el.getAttribute(a), f = FEITO.get(el) || {};
      if (f[a] !== v) o[a] = v; const novo = lang === "en" ? tr(o[a]) : o[a]; if (novo !== v) el.setAttribute(a, novo); f[a] = el.getAttribute(a); FEITO.set(el, f); }
  }
  function aplicar(raiz) {
    if (!raiz) return;
    if (raiz.nodeType === 3) return trTexto(raiz);
    if (raiz.nodeType !== 1) return;
    if (raiz.hasAttribute && ATTR.some(a => raiz.hasAttribute(a))) trAttrs(raiz);
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT); let n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) trTexto(n); else if (ATTR.some(a => n.hasAttribute(a))) trAttrs(n); }
  }
  let ocupado = false;
  const obs = new MutationObserver(ms => { if (ocupado) return; ocupado = true;
    try { for (const m of ms) { if (m.type === "characterData") trTexto(m.target); else if (m.type === "attributes") trAttrs(m.target); else m.addedNodes.forEach(aplicar); } } finally { ocupado = false; } });
  function botoes() { document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang))); document.documentElement.lang = lang === "en" ? "en" : "pt"; }
  function mudar(l) { lang = l; try { localStorage.setItem("tes-lang", l); } catch (e) {} botoes(); aplicar(document.body); if (typeof window.render === "function") window.render(); }
  document.addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (b) mudar(b.dataset.lang); });
  // confirmações e alertas do navegador
  const conf = window.confirm.bind(window), al = window.alert.bind(window);
  const trMsg = s => String(s).split("\n").map(l => { const m = l.match(/^(• )?(.*)$/); return (m[1] || "") + (trLinha(m[2]) ?? m[2]); }).join("\n");
  function trLinha(l) { if (lang !== "en" || !l.trim()) return l;
    let m = l.match(/^(Esta cópia|Este navegador) tem (\d+) membros e (\d+) movimentos\.$/); if (m) return (m[1] === "Esta cópia" ? "This backup" : "This browser") + " has " + m[2] + " members and " + m[3] + " transactions.";
    m = l.match(/^Importar de (.+):$/); if (m) return "Import from " + m[1] + ":";
    m = l.match(/^(\d+) linhas ignoradas \(repetidas ou incompletas\)\.$/); if (m) return m[1] + " rows skipped (duplicates or incomplete).";
    m = l.match(/^(\d+) (.+)$/); if (m && PARTES[m[2]]) return m[1] + " " + PARTES[m[2]];
    const E = { "Vão ser gravados na base de dados MySQL. Registos com o mesmo identificador são substituídos; os outros ficam como estão. Os utilizadores só entram se ainda não existirem.": "They will be saved to the MySQL database. Records with the same id are replaced; others stay as they are. Users are only added if they do not exist yet.",
      "Importar substitui todos os dados deste navegador. Antes disso, será baixada uma cópia dos dados actuais, por segurança.": "Importing replaces all data in this browser. A backup of the current data will be downloaded first, for safety." };
    return E[l] ?? tr(l); }
  window.confirm = m => conf(lang === "en" ? trMsg(m) : m);
  window.alert = m => al(lang === "en" ? trMsg(m) : m);
  function iniciar() { botoes(); aplicar(document.body); obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTR }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
