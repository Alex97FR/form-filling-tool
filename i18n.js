(() => {
  const languages = { zh: '中文', en: 'English', pt: 'Português', sw: 'Kiswahili', fr: 'Français' };
  const columns = ['en', 'pt', 'sw', 'fr'];
  const messages = new Map(`
界面语言|Interface language|Idioma da interface|Lugha ya kiolesura|Langue de l’interface
表格自动化控制台|Spreadsheet automation console|Console de automação de planilhas|Dashibodi ya uendeshaji wa lahajedwali|Console d’automatisation des feuilles
尚未验证 Google API|Google API authorization pending|Autorização da API Google pendente|Idhini ya API ya Google inasubiriwa|Autorisation de l’API Google en attente
授权 Google|Authorize Google|Autorizar Google|Ruhusu ufikiaji wa Google|Autoriser Google
当前流程|Current workflow|Fluxo atual|Mchakato wa sasa|Flux actuel
转交表格|Transfer spreadsheet data|Transferir dados da planilha|Hamisha data ya lahajedwali|Transférer les données
等待从 Google 表格接收选区数据。|Waiting for a selection from Google Sheets.|Aguardando uma seleção do Google Planilhas.|Inasubiri data iliyochaguliwa kutoka Majedwali ya Google.|En attente d’une sélection Google Sheets.
开始转交|Start transfer|Iniciar transferência|Anza uhamisho|Lancer le transfert
控制台页面|Console pages|Páginas do console|Kurasa za dashibodi|Pages de la console
流程控制|Workflow|Fluxo de trabalho|Mchakato|Flux de travail
参数配置|Configuration|Configuração|Mipangilio|Configuration
流程进度|Workflow progress|Progresso do fluxo|Maendeleo ya mchakato|Progression
执行日志|Activity log|Registro de execução|Kumbukumbu za utekelezaji|Journal d’exécution
重跑上次失败行|Retry failed rows|Reprocessar linhas com falha|Jaribu tena safu mlalo zilizoshindwa|Relancer les lignes en échec
清空|Clear|Limpar|Futa|Effacer
目标表诊断|Destination diagnostics|Diagnóstico do destino|Uchunguzi wa lahajedwali lengwa|Diagnostic de la destination
诊断目标表|Diagnose destination|Diagnosticar destino|Chunguza lahajedwali lengwa|Diagnostiquer la destination
复制诊断结果|Copy diagnostic report|Copiar relatório de diagnóstico|Nakili ripoti ya uchunguzi|Copier le rapport de diagnostic
使用参数配置中的目标表，只读检查表格规模、保护设置和读取耗时。每项读取最多等待 30 秒；不写入、不插行，读取成功也不代表具备写入权限。请在转交停止后运行。|Check the configured spreadsheet’s size, protections and read times. Each read times out after 30 seconds. This check neither writes nor inserts rows, and successful reads do not confirm write access. Run after the transfer stops.|Verifique o tamanho, as proteções e os tempos de leitura da planilha configurada. Cada leitura tem limite de 30 segundos. O diagnóstico não grava nem insere linhas. Uma leitura bem-sucedida não confirma permissão de edição. Execute após a transferência parar.|Kagua ukubwa, ulinzi na muda wa kusoma lahajedwali lililowekwa. Kila usomaji una kikomo cha sekunde 30. Uchunguzi hauandiki wala kuingiza safu mlalo. Kusoma hakuthibitishi ruhusa ya kuandika. Endesha baada ya uhamisho kusimama.|Vérifiez la taille, les protections et les temps de lecture de la feuille configurée. Chaque lecture est limitée à 30 secondes. Le diagnostic ne modifie ni n’ajoute de lignes. Une lecture réussie ne garantit pas le droit d’écriture. Lancez le diagnostic après l’arrêt du transfert.
本机保存|Stored locally|Salvo localmente|Imehifadhiwa kwenye kifaa|Enregistré sur cet appareil
转交目标|Transfer destination|Destino da transferência|Mahali pa kuhamishia data|Destination du transfert
目标表格网址|Destination spreadsheet URL|URL da planilha de destino|URL ya lahajedwali lengwa|URL du classeur de destination
目标分表名称|Destination tab name|Nome da aba de destino|Jina la kichupo lengwa|Nom de l’onglet de destination
目标分表名称（可选）|Destination tab name (optional)|Nome da aba de destino (opcional)|Jina la kichupo lengwa (si lazima)|Nom de l’onglet de destination (facultatif)
例如：2026年6月|Example: June 2026|Exemplo: junho de 2026|Mfano: Juni 2026|Exemple : juin 2026
目标表头行数|Destination header rows|Linhas de cabeçalho no destino|Idadi ya safu mlalo za kichwa|Nombre de lignes d’en-tête à destination
默认 2|Default: 2|Padrão: 2|Chaguo-msingi: 2|Par défaut : 2
源数据来源|Source team|Equipe de origem|Timu chanzo|Équipe source
队伍1（非 - 法）|Team 1 (Africa – French)|Equipe 1 (África – francês)|Timu 1 (Afrika – Kifaransa)|Équipe 1 (Afrique – français)
队伍2（欧 - 法）|Team 2 (Europe – French)|Equipe 2 (Europa – francês)|Timu 2 (Ulaya – Kifaransa)|Équipe 2 (Europe – français)
队伍3（非 - 英）|Team 3 (Africa – English)|Equipe 3 (África – inglês)|Timu 3 (Afrika – Kiingereza)|Équipe 3 (Afrique – anglais)
队伍4（非 - 葡）|Team 4 (Africa – Portuguese)|Equipe 4 (África – português)|Timu 4 (Afrika – Kireno)|Équipe 4 (Afrique – portugais)
队伍5（非 - 斯）|Team 5 (Africa – Swahili)|Equipe 5 (África – suaíli)|Timu 5 (Afrika – Kiswahili)|Équipe 5 (Afrique – swahili)
人员 ID|Personnel ID|ID do colaborador|Kitambulisho cha mfanyakazi|Identifiant du personnel
输入人员 ID，将写入 I 列|Enter an ID for column I|Digite o ID para a coluna I|Weka kitambulisho cha safu wima I|Saisissez l’identifiant pour la colonne I
A 列时间|Column A time|Horário da coluna A|Muda wa safu wima A|Heure de la colonne A
请选择 A 列日期/时间|Select a date/time for column A|Selecione a data/hora da coluna A|Chagua tarehe au muda wa safu wima A|Sélectionnez une date ou une heure pour la colonne A
E 列状态|Column E status|Status da coluna E|Hali ya safu wima E|Statut de la colonne E
请输入要写入 E 列的状态|Enter the status for column E|Digite o status da coluna E|Weka hali ya safu wima E|Saisissez le statut de la colonne E
编辑 A 列时间选项|Edit column A time options|Editar horários da coluna A|Hariri chaguo za muda za safu wima A|Modifier les heures proposées pour la colonne A
每行一个时间|One time per line|Um horário por linha|Muda mmoja kwa kila mstari|Une heure par ligne
智能补全|Smart completion|Preenchimento inteligente|Ujazaji mahiri|Complétion intelligente
地区配置分表|Region settings tab|Aba de configuração regional|Kichupo cha mipangilio ya maeneo|Onglet des paramètres régionaux
队伍 4 地区配置分表|Team 4 region settings tab|Aba de configuração regional da equipe 4|Kichupo cha mipangilio ya maeneo cha timu 4|Onglet des paramètres régionaux de l’équipe 4
队伍 5 地区配置分表|Team 5 region settings tab|Aba de configuração regional da equipe 5|Kichupo cha mipangilio ya maeneo cha timu 5|Onglet des paramètres régionaux de l’équipe 5
填写目标表格网址对应工作簿内的分表名称|Enter a tab name from the destination spreadsheet|Digite o nome de uma aba da planilha de destino|Weka jina la kichupo cha lahajedwali lengwa|Saisissez le nom d’un onglet du classeur de destination
填写目标工作簿内的分表名称|Enter a tab name from the destination workbook|Digite o nome de uma aba da pasta de trabalho de destino|Weka jina la kichupo cha kitabu lengwa|Saisissez le nom d’un onglet du classeur de destination
刷新地区配置|Refresh region settings|Atualizar configuração regional|Sasisha mipangilio ya maeneo|Actualiser les paramètres régionaux
授权后自动读取，之后每天 12:00 检查|Loads after authorization and checks daily at 12:00|Carrega após a autorização e verifica diariamente às 12:00|Hupakiwa baada ya idhini na kukaguliwa kila siku saa 12:00|Chargement après autorisation, puis vérification quotidienne à 12 h
Gemini / Gemma 模型|Gemini / Gemma model|Modelo Gemini / Gemma|Muundo wa Gemini / Gemma|Modèle Gemini / Gemma
Gemini 3.5 Flash Lite（推荐：15 RPM / 500 RPD）|Gemini 3.5 Flash Lite (recommended: 15 RPM / 500 RPD)|Gemini 3.5 Flash Lite (recomendado: 15 RPM / 500 RPD)|Gemini 3.5 Flash Lite (inapendekezwa: 15 RPM / 500 RPD)|Gemini 3.5 Flash Lite (recommandé : 15 RPM / 500 RPD)
Gemini 2.5 Flash Lite（备用：10 RPM / 20 RPD）|Gemini 2.5 Flash Lite (fallback: 10 RPM / 20 RPD)|Gemini 2.5 Flash Lite (alternativo: 10 RPM / 20 RPD)|Gemini 2.5 Flash Lite (mbadala: 10 RPM / 20 RPD)|Gemini 2.5 Flash Lite (secours : 10 RPM / 20 RPD)
Gemini 3.5 Flash（能力更强：5 RPM / 20 RPD）|Gemini 3.5 Flash (more capable: 5 RPM / 20 RPD)|Gemini 3.5 Flash (mais avançado: 5 RPM / 20 RPD)|Gemini 3.5 Flash (uwezo zaidi: 5 RPM / 20 RPD)|Gemini 3.5 Flash (plus performant : 5 RPM / 20 RPD)
Gemma 4 26B（推荐高额度：30 RPM / 14.4K RPD）|Gemma 4 26B (recommended high quota: 30 RPM / 14.4K RPD)|Gemma 4 26B (cota alta recomendada: 30 RPM / 14.4K RPD)|Gemma 4 26B (kiwango cha juu kinachopendekezwa: 30 RPM / 14.4K RPD)|Gemma 4 26B (quota élevé recommandé : 30 RPM / 14,4 k RPD)
Gemma 4 31B（高额度：30 RPM / 14.4K RPD）|Gemma 4 31B (high quota: 30 RPM / 14.4K RPD)|Gemma 4 31B (cota alta: 30 RPM / 14.4K RPD)|Gemma 4 31B (kiwango cha juu: 30 RPM / 14.4K RPD)|Gemma 4 31B (quota élevé : 30 RPM / 14,4 k RPD)
申请 API Key|Get an API key|Obter chave de API|Pata ufunguo wa API|Obtenir une clé API
AQ... 或 AIza...|AQ... or AIza...|AQ... ou AIza...|AQ... au AIza...|AQ... ou AIza...
显示 API Key|Show API key|Mostrar chave de API|Onyesha ufunguo wa API|Afficher la clé API
每行一个密钥，按顺序轮询|One key per line, used in order|Uma chave por linha, usada em ordem|Ufunguo mmoja kwa kila mstari, kwa mpangilio|Une clé par ligne, utilisée dans l’ordre
隐藏 API Key|Hide API key|Ocultar chave de API|Ficha ufunguo wa API|Masquer la clé API
报告拆解服务|Report analysis provider|Provedor de análise de relatórios|Mtoa huduma wa uchanganuzi wa ripoti|Fournisseur d’analyse des rapports
OpenRouter 模型 ID|OpenRouter model ID|ID do modelo OpenRouter|Kitambulisho cha modeli ya OpenRouter|Identifiant du modèle OpenRouter
OpenAI 模型 ID|OpenAI model ID|ID do modelo OpenAI|Kitambulisho cha modeli ya OpenAI|Identifiant du modèle OpenAI
各服务的 API Key 分别保存在本机扩展存储中。切换服务后，请点击「保存配置」。|Each provider’s API key is stored locally. After switching providers, select Save configuration.|A chave de cada provedor é armazenada localmente. Depois de trocar de provedor, selecione Salvar configuração.|Ufunguo wa API wa kila mtoa huduma huhifadhiwa kwenye kifaa hiki. Baada ya kubadili mtoa huduma, chagua Hifadhi mipangilio.|Chaque clé API est stockée localement. Après avoir changé de fournisseur, sélectionnez Enregistrer la configuration.
运行报告拆解时，报告正文会发送给已保存的服务处理。请避免发送不必要的敏感信息。|Report analysis sends the report text to the configured provider. Avoid sending unnecessary sensitive information.|A análise envia o texto do relatório ao provedor configurado. Evite enviar informações confidenciais desnecessárias.|Uchanganuzi hutuma maandishi ya ripoti kwa mtoa huduma aliyesanidiwa. Epuka kutuma taarifa nyeti zisizohitajika.|L’analyse envoie le texte du rapport au fournisseur configuré. Évitez d’envoyer des informations sensibles superflues.
保存配置|Save configuration|Salvar configuração|Hifadhi mipangilio|Enregistrer la configuration
导出配置|Export configuration|Exportar configuração|Hamisha mipangilio kwenye faili|Exporter la configuration
导入配置|Import configuration|Importar configuração|Ingiza mipangilio kutoka kwenye faili|Importer la configuration
清除所有配置|Clear all configuration|Apagar toda a configuração|Futa mipangilio yote|Effacer toute la configuration
导出文件不包含 API Key。在其他设备导入后，请重新填写密钥。|Export files omit the API key. Re-enter it after importing on another device.|Os arquivos exportados não incluem a chave de API. Digite-a novamente após importar em outro dispositivo.|Faili inayohamishwa haina ufunguo wa API. Uandike tena baada ya kuingiza faili kwenye kifaa kingine.|Le fichier exporté exclut la clé API. Saisissez-la de nouveau après l’importation sur un autre appareil.
表格转交设置|Spreadsheet transfer settings|Configurações de transferência|Mipangilio ya uhamisho wa lahajedwali|Paramètres de transfert
先在这里填写目标表格。以后在 A 表中选中要转交的行（建议只选 B 到 BL），按 Ctrl+C，再右键点击“转交表格”。目标表格必须是当前 Google 账号有权限编辑的表格。|Set the destination here. In source sheet A, select the rows to transfer (columns B to BL are recommended), press Ctrl+C, then right-click and choose Transfer spreadsheet data. Your Google account needs edit access to the destination.|Defina o destino aqui. Na planilha A, selecione as linhas a transferir (recomenda-se selecionar as colunas B a BL), pressione Ctrl+C e clique com o botão direito para escolher Transferir dados da planilha. Sua conta Google precisa ter permissão de edição no destino.|Weka lahajedwali lengwa hapa. Katika lahajedwali A, chagua safu mlalo za kuhamisha (safu wima B hadi BL zinapendekezwa), bonyeza Ctrl+C, kisha bofya kulia na uchague Hamisha data ya lahajedwali. Akaunti yako ya Google inahitaji ruhusa ya kuhariri lahajedwali lengwa.|Définissez la destination ici. Dans la feuille source A, sélectionnez les lignes à transférer (colonnes B à BL de préférence), appuyez sur Ctrl+C, puis faites un clic droit et choisissez Transférer les données. Votre compte Google doit pouvoir modifier la destination.
保存设置|Save settings|Salvar configurações|Hifadhi mipangilio|Enregistrer les paramètres
请输入有效的 Google 表格网址|Enter a valid Google Sheets URL|Digite um URL válido do Google Planilhas|Weka URL halali ya Majedwali ya Google|Saisissez une URL Google Sheets valide
已保存|Saved|Salvo|Imehifadhiwa|Enregistré
准备与转交|Prepare and transfer|Preparar e transferir|Andaa na uhamishe|Préparation et transfert
读取选区|Read selection|Ler seleção|Soma sehemu iliyochaguliwa|Lire la sélection
Google 授权|Google authorization|Autorização do Google|Idhini ya Google|Autorisation Google
定位目标行|Locate destination row|Localizar linha de destino|Tafuta safu mlalo lengwa|Repérer la ligne de destination
写入 C:BM|Write C:BM|Gravar em C:BM|Andika katika C:BM|Écrire dans C:BM
字段整理|Organize fields|Organizar campos|Panga sehemu za data|Organisation des champs
清空 G 列|Clear column G|Limpar coluna G|Futa yaliyomo katika safu wima G|Vider la colonne G
更新 E 列|Update column E|Atualizar coluna E|Sasisha safu wima E|Mettre à jour la colonne E
写入 C 日期|Set date in C|Gravar data em C|Weka tarehe katika C|Écrire la date en C
写入 A 列时间|Set time in column A|Gravar horário na coluna A|Weka muda katika safu wima A|Écrire l’heure en colonne A
同步地区配置|Sync region settings|Sincronizar configuração regional|Sawazisha mipangilio ya maeneo|Synchroniser les paramètres régionaux
Q 区号补全 V|Fill V from Q dialing codes|Preencher V com códigos de Q|Jaza V kwa misimbo ya simu ya Q|Compléter V avec les indicatifs de Q
拆解 AL 报告|Analyze reports in AL|Analisar relatórios em AL|Changanua ripoti katika AL|Analyser les rapports en AL
回写 S/W/X/Y/Z/AA/AJ|Update S/W/X/Y/Z/AA/AJ|Atualizar S/W/X/Y/Z/AA/AJ|Sasisha S/W/X/Y/Z/AA/AJ|Mettre à jour S/W/X/Y/Z/AA/AJ
确定|Confirm|Confirmar|Thibitisha|Confirmer
取消|Cancel|Cancelar|Ghairi|Annuler
知道了|OK|OK|Sawa|OK
扩展程序表格转交提示：|Spreadsheet transfer|Transferência de planilhas|Uhamisho wa data|Transfert de données
重新授权|Reauthorize|Autorizar novamente|Toa idhini tena|Autoriser de nouveau
正在等待授权…|Waiting for authorization…|Aguardando autorização…|Inasubiri idhini…|En attente d’autorisation…
已授权|Authorized|Autorizado|Imeidhinishwa|Autorisé
Google API 已授权|Google API authorized|API Google autorizada|API ya Google imeidhinishwa|API Google autorisée
执行中…|Running…|Executando…|Inaendelea…|En cours…
诊断中…|Diagnosing…|Diagnosticando…|Inachunguza…|Diagnostic en cours…
配置已保存|Configuration saved|Configuração salva|Mipangilio imehifadhiwa|Configuration enregistrée
转交流程已完成。|Transfer completed.|Transferência concluída.|Uhamisho umekamilika.|Transfert terminé.
流程未完成，请查看执行日志。|Workflow incomplete. Check the activity log.|Fluxo incompleto. Consulte o registro de execução.|Mchakato haujakamilika. Angalia kumbukumbu za utekelezaji.|Processus incomplet. Consultez le journal d’exécution.
已从 Google 表格接收选区数据，可以开始转交。|Selection received from Google Sheets. Ready to transfer.|Seleção recebida do Google Planilhas. Pronto para transferir.|Data iliyochaguliwa imepokelewa kutoka Majedwali ya Google. Uhamisho unaweza kuanza.|Sélection Google Sheets reçue. Le transfert peut commencer.
写入前确认选区|Confirm selection before writing|Confirmar seleção antes de gravar|Thibitisha sehemu iliyochaguliwa kabla ya kuandika|Confirmer la sélection avant l’écriture
确认无误，开始转交|Confirm and start transfer|Confirmar e iniciar transferência|Thibitisha na uanze uhamisho|Confirmer et lancer le transfert
完成|Done|Concluir|Nimemaliza|Terminé
重新复制数据|Copy data again|Copiar dados novamente|Nakili data tena|Copier à nouveau les données
转交数据已准备好|Transfer data ready|Dados prontos para transferir|Data ya kuhamisha iko tayari|Données prêtes à transférer
请在目标表点击首个空行，然后按 Ctrl+V 粘贴。|Click the first empty row in the destination, then press Ctrl+V to paste.|Clique na primeira linha vazia do destino e pressione Ctrl+V para colar.|Bofya safu mlalo ya kwanza iliyo tupu, kisha bonyeza Ctrl+V ili kubandika.|Cliquez sur la première ligne vide de la destination, puis appuyez sur Ctrl+V pour coller.
请填写 E 列状态|Enter the status for column E|Preencha o status da coluna E|Weka hali ya safu wima E|Renseignez le statut de la colonne E
请先填写 E 列状态。|Enter the status for column E first.|Preencha primeiro o status da coluna E.|Weka kwanza hali ya safu wima E.|Renseignez d’abord le statut de la colonne E.
请填写至少一个 A 列时间选项|Enter at least one time option for column A|Digite pelo menos um horário para a coluna A|Weka angalau chaguo moja la muda wa safu wima A|Saisissez au moins une heure pour la colonne A
请先选择 A 列日期/时间。|Select a date or time for column A first.|Selecione primeiro a data ou hora da coluna A.|Chagua kwanza tarehe au muda wa safu wima A.|Sélectionnez d’abord une date ou une heure pour la colonne A.
请填写地区配置分表名称|Enter the region settings tab name|Digite o nome da aba de configuração regional|Weka jina la kichupo cha mipangilio ya maeneo|Saisissez le nom de l’onglet des paramètres régionaux
请先填写地区配置分表名称。|Enter the region settings tab name first.|Digite primeiro o nome da aba de configuração regional.|Weka kwanza jina la kichupo cha mipangilio ya maeneo.|Saisissez d’abord le nom de l’onglet des paramètres régionaux.
请填写 {0} API Key|Enter the {0} API key|Digite a chave da API {0}|Weka ufunguo wa API ya {0}|Saisissez la clé API {0}
配置已导出（不含 API Key）|Configuration exported (API key excluded)|Configuração exportada (sem a chave de API)|Mipangilio imehamishwa kwenye faili (bila ufunguo wa API)|Configuration exportée (sans clé API)
确定清除所有配置、API Key 和本地数据吗？此操作不可撤销。|Permanently delete all configuration, the API key and local data?|Apagar permanentemente toda a configuração, a chave de API e os dados locais?|Ufute kabisa mipangilio yote, ufunguo wa API na data ya kwenye kifaa?|Supprimer définitivement toute la configuration, la clé API et les données locales ?
配置已清除，页面将重新加载。|Configuration cleared. The page will reload.|Configuração apagada. A página será recarregada.|Mipangilio imefutwa. Ukurasa utapakiwa upya.|Configuration effacée. La page va se recharger.
配置导入成功，页面将重新加载。|Configuration imported. The page will reload.|Configuração importada. A página será recarregada.|Mipangilio imeingizwa. Ukurasa utapakiwa upya.|Configuration importée. La page va se recharger.
配置导入失败：文件不是有效的 JSON。|Import failed: the file is not valid JSON.|Falha na importação: o arquivo não é um JSON válido.|Uingizaji umeshindwa: faili si JSON halali.|Échec de l’importation : le fichier JSON est invalide.
操作已阻止：请先复制 A 表选中的整行。|Copy the full selected rows from source sheet A first.|Copie primeiro as linhas completas selecionadas na planilha A.|Nakili kwanza safu mlalo nzima zilizochaguliwa katika lahajedwali A.|Copiez d’abord les lignes entières sélectionnées dans la feuille source A.
操作已阻止：没有检测到完整选区。|No complete selection was detected.|Nenhuma seleção completa foi detectada.|Hakuna sehemu kamili iliyochaguliwa iliyopatikana.|Aucune sélection complète n’a été détectée.
已取消，等待下一次转交。|Canceled. Ready for the next transfer.|Cancelado. Aguardando a próxima transferência.|Umeghairiwa. Inasubiri uhamisho unaofuata.|Annulé. En attente du prochain transfert.
正在请求 Google 授权|Requesting Google authorization|Solicitando autorização do Google|Inaomba idhini ya Google|Demande d’autorisation Google
控制台已就绪，等待操作。|Console ready.|Console pronto.|Dashibodi iko tayari.|Console prête.
日志已清空。|Log cleared.|Registro limpo.|Kumbukumbu zimefutwa.|Journal effacé.
当前队伍每次运行重新读取地区配置。|Region settings are reloaded for this team on each run.|A configuração regional desta equipe é recarregada a cada execução.|Mipangilio ya maeneo ya timu hii hupakiwa upya kila inapotekelezwa.|Les paramètres régionaux de cette équipe sont rechargés à chaque exécution.
授权后自动读取，之后每天 12:00 检查。|Loads after authorization and checks daily at 12:00.|Carrega após a autorização e verifica diariamente às 12:00.|Hupakiwa baada ya idhini na kukaguliwa kila siku saa 12:00.|Chargement après autorisation, puis vérification quotidienne à 12 h.
已把选区交给自动化控制台。|Selection sent to the automation console.|Seleção enviada ao console de automação.|Data iliyochaguliwa imetumwa kwenye dashibodi.|Sélection envoyée à la console d’automatisation.
转交失败。|Transfer failed.|Falha na transferência.|Uhamisho umeshindwa.|Échec du transfert.
数据已复制，请点击目标首个空行后按 Ctrl+V。|Data copied. Click the first empty destination row and press Ctrl+V.|Dados copiados. Clique na primeira linha vazia do destino e pressione Ctrl+V.|Data imenakiliwa. Bofya safu mlalo ya kwanza iliyo tupu kisha bonyeza Ctrl+V.|Données copiées. Cliquez sur la première ligne vide de la destination et appuyez sur Ctrl+V.
没有读到选区内容，请先选择 B 列到 BL 列的行。|No selection data found. Select rows across columns B to BL first.|Nenhum dado da seleção encontrado. Selecione primeiro as linhas das colunas B a BL.|Hakuna data iliyopatikana. Chagua kwanza safu mlalo katika safu wima B hadi BL.|Aucune donnée sélectionnée. Sélectionnez d’abord des lignes sur les colonnes B à BL.
未检测到本次选区数据。请先回到 A 表选择整行，按 Ctrl+C 复制，再右键点击“转交表格”。|No selection was received. In source sheet A, select entire rows, press Ctrl+C, then right-click and choose Transfer spreadsheet data.|Nenhuma seleção recebida. Na planilha A, selecione linhas inteiras, pressione Ctrl+C e clique com o botão direito para escolher Transferir dados da planilha.|Hakuna data iliyopokelewa. Katika lahajedwali A, chagua safu mlalo nzima, bonyeza Ctrl+C, kisha bofya kulia na uchague Hamisha data ya lahajedwali.|Aucune sélection reçue. Dans la feuille A, sélectionnez les lignes entières, appuyez sur Ctrl+C, puis faites un clic droit et choisissez Transférer les données.
只读取到 1 个单元格，疑似没有复制当前整行。请回到 A 表选择整行并按 Ctrl+C。|Only one cell was received. Select the entire row in source sheet A and press Ctrl+C.|Apenas uma célula foi recebida. Selecione a linha inteira na planilha A e pressione Ctrl+C.|Seli moja tu imepokelewa. Chagua safu mlalo nzima katika lahajedwali A kisha bonyeza Ctrl+C.|Une seule cellule a été reçue. Sélectionnez la ligne entière dans la feuille A et appuyez sur Ctrl+C.
从 A 列开始|Start at column A|Começar na coluna A|Anza katika safu wima A|Commencer à la colonne A
从 B 列开始（推荐：右键整行复制通常如此）|Start at column B (typical for whole rows copied via right-click)|Começar na coluna B (comum ao copiar linhas inteiras pelo menu de contexto)|Anza katika safu wima B (kawaida kwa safu mlalo nzima zilizonakiliwa kwa kubofya kulia)|Commencer à la colonne B (cas habituel après copie de lignes entières via le menu contextuel)
组别2会按内置列映射写入目标 C:BM；L 列和 M 列会合并写入目标 M 列。请确认预览中的字段对应正确。|Team 2 uses a fixed mapping into C:BM. Columns L and M are merged into destination column M. Check the mapping in the preview.|A equipe 2 usa um mapeamento fixo para C:BM. As colunas L e M são mescladas na coluna M de destino. Confira o mapeamento na prévia.|Timu 2 hutumia mpangilio maalumu wa safu wima katika C:BM. Safu wima L na M huunganishwa katika safu wima lengwa M. Hakiki mpangilio katika hakikisho.|L’équipe 2 utilise une correspondance fixe vers C:BM. Les colonnes L et M sont fusionnées dans la colonne M de destination. Vérifiez la correspondance dans l’aperçu.
请核对下面前几列的值与源表一致——若整体错了一列，通常是起始列判断反了，用下面的开关纠正。数据将写入目标表的 C:BM。|Check the first few columns against the source. If the data is offset by one column, change the starting column below. Data will be written to C:BM.|Confira as primeiras colunas com a planilha de origem. Se os dados estiverem deslocados uma coluna, altere a coluna inicial abaixo. Os dados serão gravados em C:BM.|Linganisha safu wima za kwanza na lahajedwali chanzo. Data ikisogea kwa safu wima moja, badili safu wima ya kuanzia hapa chini. Data itaandikwa katika C:BM.|Vérifiez les premières colonnes par rapport à la source. Si les données sont décalées d’une colonne, changez la colonne de départ ci-dessous. Les données seront écrites dans C:BM.
Google API 已授权（{0}）|Google API authorized ({0})|API Google autorizada ({0})|API ya Google imeidhinishwa ({0})|API Google autorisée ({0})
已读取缓存：{0} 行，{1}；每天 12:00 检查|Cache loaded: {0} rows, {1}. Checked daily at 12:00.|Cache carregado: {0} linhas, {1}. Verificação diária às 12:00.|Akiba imepakiwa: safu mlalo {0}, {1}. Hukaguliwa kila siku saa 12:00.|Cache chargé : {0} lignes, {1}. Vérification quotidienne à 12 h.
已读取缓存：{0} 行，{1}；24 小时内无需检查|Cache loaded: {0} rows, {1}. Next check after 24 hours.|Cache carregado: {0} linhas, {1}. Próxima verificação após 24 horas.|Akiba imepakiwa: safu mlalo {0}, {1}. Itakaguliwa baada ya saa 24.|Cache chargé : {0} lignes, {1}. Prochaine vérification après 24 heures.
已读取地区配置：{0} 行；当前队伍每次运行重新读取|Region settings loaded: {0} rows. Reloaded on each run for this team.|Configuração regional carregada: {0} linhas. Recarregada a cada execução desta equipe.|Mipangilio ya maeneo imepakiwa: safu mlalo {0}. Hupakiwa upya kila timu hii inapoendesha mchakato.|Paramètres régionaux chargés : {0} lignes. Rechargés à chaque exécution pour cette équipe.
地区配置读取为空，保留原缓存；请检查配置分表是否被清空。|No region settings were found. The previous cache was kept. Check the settings tab.|Nenhuma configuração regional encontrada. O cache anterior foi mantido. Verifique a aba de configuração.|Mipangilio ya maeneo haikupatikana. Akiba ya awali imehifadhiwa. Kagua kichupo cha mipangilio.|Aucun paramètre régional trouvé. Le cache précédent a été conservé. Vérifiez l’onglet des paramètres.
已检查，配置无变化：{0} 行，{1}|Checked: no changes to {0} rows, {1}.|Verificado: sem alterações nas {0} linhas, {1}.|Imekaguliwa: hakuna mabadiliko katika safu mlalo {0}, {1}.|Vérification terminée : {0} lignes inchangées, {1}.
检测到地区配置有变化，已更新：{0} 行，{1}|Region settings changed and were updated: {0} rows, {1}.|A configuração regional mudou e foi atualizada: {0} linhas, {1}.|Mipangilio ya maeneo imebadilika na kusasishwa: safu mlalo {0}, {1}.|Paramètres régionaux modifiés et actualisés : {0} lignes, {1}.
已更新地区配置：{0} 行，{1}|Region settings updated: {0} rows, {1}.|Configuração regional atualizada: {0} linhas, {1}.|Mipangilio ya maeneo imesasishwa: safu mlalo {0}, {1}.|Paramètres régionaux actualisés : {0} lignes, {1}.
地区配置刷新失败：{0}|Could not refresh region settings: {0:t}|Falha ao atualizar a configuração regional: {0:t}|Imeshindikana kusasisha mipangilio ya maeneo: {0:t}|Échec de l’actualisation des paramètres régionaux : {0:t}
重跑上次失败行（{0}）|Retry failed rows ({0})|Reprocessar linhas com falha ({0})|Jaribu tena safu mlalo zilizoshindwa ({0})|Relancer les lignes en échec ({0})
已接收选区数据，共 {0} 行。|Selection received: {0} rows.|Seleção recebida: {0} linhas.|Sehemu iliyochaguliwa imepokelewa: safu mlalo {0}.|Sélection reçue : {0} lignes.
地区配置已读取，共 {0} 行。|Loaded {0} rows of region settings.|Foram carregadas {0} linhas de configuração regional.|Safu mlalo {0} za mipangilio ya maeneo zimepakiwa.|{0} lignes de paramètres régionaux chargées.
地区配置已刷新，共 {0} 行；后续识别使用本次层级。|Region settings refreshed: {0} rows. Future matching uses this hierarchy.|Configuração regional atualizada: {0} linhas. As próximas correspondências usarão esta hierarquia.|Mipangilio ya maeneo imesasishwa: safu mlalo {0}. Ulinganishaji utatumia mpangilio huu wa maeneo.|Paramètres régionaux actualisés : {0} lignes. Les prochaines correspondances utiliseront cette hiérarchie.
目标位置已保存：{0}|Destination saved: {0}|Destino salvo: {0}|Mahali lengwa pamehifadhiwa: {0}|Destination enregistrée : {0}
开始执行转交流程。|Starting the transfer workflow.|Iniciando o fluxo de transferência.|Mchakato wa uhamisho unaanza.|Démarrage du processus de transfert.
请求 Google Sheets 编辑权限。|Requesting Google Sheets edit access.|Solicitando permissão de edição no Google Planilhas.|Inaomba ruhusa ya kuhariri Majedwali ya Google.|Demande d’accès en écriture à Google Sheets.
Google 授权成功。|Google authorization succeeded.|Autorização do Google concluída.|Idhini ya Google imepatikana.|Autorisation Google obtenue.
Google 授权成功，可以访问表格。|Google authorization succeeded. Spreadsheet access is available.|Autorização do Google concluída. O acesso à planilha está disponível.|Idhini ya Google imepatikana. Lahajedwali linaweza kufikiwa.|Autorisation Google obtenue. Le classeur est accessible.
Google 授权凭证已失效，正在自动刷新并重试。|Google authorization expired. Refreshing and retrying.|A autorização do Google expirou. Renovando e tentando novamente.|Idhini ya Google imeisha. Inasasishwa na jaribio litarudiwa.|L’autorisation Google a expiré. Actualisation et nouvelle tentative.
正在定位目标行：读取目标表设置，核验续传记录或查找最上面数据行。|Locating the destination row: reading settings and checking the resume record or finding the first data row.|Localizando a linha de destino: lendo as configurações e verificando o registro de retomada ou procurando a primeira linha de dados.|Inatafuta safu mlalo lengwa kwa kusoma mipangilio na kukagua rekodi ya kuendelea au kutafuta safu mlalo ya kwanza yenye data.|Recherche de la ligne de destination : lecture des paramètres, puis vérification de la reprise ou recherche de la première ligne de données.
地区配置已就绪，共 {0} 行。|Region settings are ready: {0} rows.|Configuração regional pronta: {0} linhas.|Mipangilio ya maeneo iko tayari: safu mlalo {0}.|Paramètres régionaux prêts : {0} lignes.
已完成：转交、信息完善、Q 区号补全、AL 报告拆解。|Completed transfer, field updates, Q dialing-code matching and AL report analysis.|Transferência, atualização de campos, identificação de códigos em Q e análise de relatórios em AL concluídas.|Uhamisho, usasishaji wa sehemu, ulinganishaji wa misimbo ya simu katika Q na uchanganuzi wa ripoti katika AL vimekamilika.|Transfert, mise à jour des champs, traitement des indicatifs en Q et analyse des rapports en AL terminés.
── 识别质量小结 ──|── Matching quality summary ──|── Resumo da qualidade das correspondências ──|── Muhtasari wa ubora wa ulinganishaji ──|── Bilan de la qualité des correspondances ──
诊断前请在参数配置中填写有效的目标表格网址。|Enter a valid destination URL in Configuration before running diagnostics.|Informe um URL válido de destino na configuração antes de executar o diagnóstico.|Weka URL halali ya lahajedwali lengwa katika mipangilio kabla ya uchunguzi.|Saisissez une URL de destination valide dans la configuration avant le diagnostic.
正在请求 Google 授权；仅诊断参数配置中当前填写的目标表。|Requesting Google authorization. Only the configured destination will be checked.|Solicitando autorização do Google. Somente o destino configurado será verificado.|Inaomba idhini ya Google. Uchunguzi utafanywa kwenye lahajedwali lengwa lililowekwa pekee.|Demande d’autorisation Google. Le diagnostic porte uniquement sur la destination configurée.
诊断未完成：授权未完成或刷新凭证后仍无法读取。请查看执行日志中的授权提示。|Diagnostics did not finish. Authorization was incomplete or the read failed after refreshing credentials. Check the activity log.|O diagnóstico não foi concluído. A autorização ficou incompleta ou a leitura falhou após renovar as credenciais. Consulte o registro de execução.|Uchunguzi haukukamilika. Idhini haikukamilika au usomaji ulishindwa baada ya kusasisha vitambulisho. Angalia kumbukumbu za utekelezaji.|Diagnostic incomplet. L’autorisation a échoué ou la lecture reste impossible après actualisation des identifiants. Consultez le journal.
诊断结果已复制。|Diagnostic report copied.|Relatório de diagnóstico copiado.|Ripoti ya uchunguzi imenakiliwa.|Rapport de diagnostic copié.
复制失败，请手动选择诊断结果复制。|Copy failed. Select and copy the diagnostic report manually.|Falha ao copiar. Selecione e copie o relatório manualmente.|Kunakili kumeshindwa. Chagua na unakili ripoti mwenyewe.|Échec de la copie. Sélectionnez et copiez le rapport manuellement.
开始目标表只读诊断；报告只记录规模、状态和耗时，不包含单元格正文、表格网址或访问令牌。|Starting read-only diagnostics. The report includes size, status and timing, and excludes cell contents, spreadsheet URLs and access tokens.|Iniciando diagnóstico somente leitura. O relatório inclui tamanho, estado e duração, sem conteúdo das células, URLs ou tokens de acesso.|Uchunguzi wa kusoma pekee unaanza. Ripoti ina ukubwa, hali na muda bila maudhui ya visanduku, URL au tokeni za ufikiaji.|Début du diagnostic en lecture seule. Le rapport indique la taille, l’état et la durée, sans contenu de cellules, URL de classeur ni jeton d’accès.
诊断停止：找不到配置的目标分表，请核对名称。|Diagnostics stopped: the configured tab was not found. Check its name.|Diagnóstico interrompido: a aba configurada não foi encontrada. Confira o nome.|Uchunguzi umesimama: kichupo kilichowekwa hakijapatikana. Hakiki jina.|Diagnostic interrompu : onglet configuré introuvable. Vérifiez son nom.
诊断停止：目标分表没有可读取的普通网格。|Diagnostics stopped: the destination tab has no readable grid.|Diagnóstico interrompido: a aba de destino não tem uma grade legível.|Uchunguzi umesimama: kichupo lengwa hakina gridi inayoweza kusomwa.|Diagnostic interrompu : l’onglet de destination ne contient aucune grille lisible.
目标分表网格：{0} 行 × {1} 列；整个文件 {2} 个分表、{3} 个已分配网格单元格（不等于非空数据量）。|Destination grid: {0} rows × {1} columns. Workbook: {2} tabs, {3} allocated cells (including empty cells).|Grade do destino: {0} linhas × {1} colunas. Arquivo: {2} abas, {3} células alocadas (incluindo vazias).|Gridi lengwa: safu mlalo {0} × safu wima {1}. Faili ina vichupo {2} na visanduku {3} vilivyotengwa, vikiwemo vilivyo tupu.|Grille de destination : {0} lignes × {1} colonnes. Classeur : {2} onglets et {3} cellules allouées, cellules vides comprises.
范围 {0} 返回 {1} 行、{2} 个非空单元格（不输出内容）。|Range {0} returned {1} rows and {2} nonempty cells. Cell contents are omitted.|O intervalo {0} retornou {1} linhas e {2} células não vazias. O conteúdo foi omitido.|Masafa {0} yamerudisha safu mlalo {1} na visanduku {2} vyenye data. Maudhui hayajaonyeshwa.|La plage {0} a renvoyé {1} lignes et {2} cellules non vides. Le contenu est masqué.
诊断结束：未写入、清空或插入任何表格数据；只读诊断无法证明具备写入、插行权限。|Diagnostics finished without writing, clearing or inserting data. Read-only checks cannot confirm edit or insert permissions.|O diagnóstico terminou sem gravar, limpar ou inserir dados. A leitura não confirma permissões de edição ou inserção.|Uchunguzi umekamilika bila kuandika, kufuta au kuingiza data. Ukaguzi wa kusoma pekee hauwezi kuthibitisha ruhusa za kuhariri au kuingiza safu mlalo.|Diagnostic terminé sans écriture, effacement ni insertion. La lecture seule ne confirme pas les droits de modification ou d’insertion.
开始读取：{0}（最多等待 30 秒）。|Reading {0:t} (30-second timeout).|Lendo {0:t} (limite de 30 segundos).|Inasoma {0:t} (kikomo cha sekunde 30).|Lecture de {0:t} (délai maximal de 30 secondes).
{0}：成功，用时 {1}。|{0:t}: succeeded in {1:t}.|{0:t}: sucesso em {1:t}.|{0:t}: imefanikiwa baada ya {1:t}.|{0:t} : réussite en {1:t}.
{0}：失败，用时 {1}。{2}|{0:t}: failed after {1:t}. {2:t}|{0:t}: falhou após {1:t}. {2:t}|{0:t}: imeshindwa baada ya {1:t}. {2:t}|{0:t} : échec après {1:t}. {2:t}
{0} 分 {1} 秒|{0} min {1} s|{0} min {1} s|Dakika {0} na sekunde {1}|{0} min {1} s
{0} 秒|{0} s|{0} s|Sekunde {0}|{0} s
表格基本信息|spreadsheet metadata|metadados da planilha|taarifa za msingi za lahajedwali|métadonnées du classeur
保护及条件格式设置|protections and conditional formatting|proteções e formatação condicional|ulinzi na umbizo la masharti|protections et mise en forme conditionnelle
数据范围 {0}|data range {0}|intervalo de dados {0}|masafa ya data {0}|plage de données {0}
读取超过 30 秒，已停止等待；不能仅凭超时判断是网络还是 Google 服务端问题。|Reading timed out after 30 seconds. The timeout alone does not identify whether the cause was the network or Google.|A leitura excedeu 30 segundos. O tempo limite por si só não indica se a causa foi a rede ou o Google.|Usomaji umepitisha sekunde 30. Muda kuisha pekee hakuonyeshi kama chanzo ni mtandao au Google.|La lecture a dépassé 30 secondes. Ce délai seul ne permet pas de distinguer un problème réseau d’un problème côté Google.
读取未完成：网络连接异常、请求被拦截或返回内容无法解析。|Read incomplete: network failure, blocked request or unreadable response.|Leitura incompleta: falha de rede, solicitação bloqueada ou resposta ilegível.|Usomaji haujakamilika: hitilafu ya mtandao, ombi limezuiwa au jibu halisomeki.|Lecture incomplète : problème réseau, requête bloquée ou réponse illisible.
目标分表少于 65 列，未覆盖完整 A:BM；正常转交的列范围需要检查。|The destination tab has fewer than 65 columns. Check whether it covers the required A:BM range.|A aba de destino tem menos de 65 colunas. Verifique se ela cobre o intervalo obrigatório A:BM.|Kichupo lengwa kina chini ya safu wima 65. Hakikisha kinajumuisha masafa yanayohitajika ya A:BM.|L’onglet de destination compte moins de 65 colonnes. Vérifiez qu’il couvre la plage A:BM requise.
目标分表保护范围 {0} 个，其中不允许当前授权账号编辑的范围 {1} 个；条件格式规则 {2} 条。|The destination has {0} protected ranges, {1} of which the authorized account cannot edit, and {2} conditional formatting rules.|O destino tem {0} intervalos protegidos, dos quais {1} não podem ser editados pela conta autorizada, e {2} regras de formatação condicional.|Lengwa lina masafa {0} yaliyolindwa, ambapo akaunti iliyoidhinishwa haiwezi kuhariri {1}, na sheria {2} za umbizo la masharti.|La destination contient {0} plages protégées, dont {1} interdites en écriture au compte autorisé, et {2} règles de mise en forme conditionnelle.
存在不可编辑的保护范围，但不代表本次写入区域一定受限；保护设置也不能解释所有读取失败。|Some protected ranges cannot be edited. The intended write range may still be editable, and protections do not explain all read failures.|Alguns intervalos protegidos não podem ser editados. O intervalo de gravação ainda pode ser editável, e as proteções não explicam todas as falhas de leitura.|Baadhi ya masafa yaliyolindwa hayawezi kuhaririwa. Masafa yanayolengwa bado yanaweza kuharirika, na ulinzi hauelezi kila hitilafu ya usomaji.|Certaines plages protégées sont non modifiables. La plage d’écriture prévue peut rester modifiable et les protections n’expliquent pas tous les échecs de lecture.
保护及条件格式检查未完成，继续进行数据读取对照；不能据此判断写入权限。|Protection and formatting checks did not finish. Read comparisons will continue. Write access remains undetermined.|As verificações de proteção e formatação não foram concluídas. A comparação de leituras continuará. A permissão de gravação permanece indeterminada.|Ukaguzi wa ulinzi na umbizo haujakamilika. Ulinganishaji wa usomaji unaendelea. Ruhusa ya kuandika haijathibitishwa.|Vérification des protections et du formatage incomplète. La comparaison des lectures se poursuit. Le droit d’écriture reste indéterminé.
结论：本次三项数据读取均成功，当前未复现读取卡住；仍需结合正常流程日志检查续传、插行或写入阶段。|All three data reads succeeded. No stall was reproduced. Check the workflow log for resume, row insertion or write issues.|As três leituras foram bem-sucedidas. O travamento não foi reproduzido. Consulte o registro para verificar retomada, inserção de linhas ou gravação.|Usomaji wote mitatu umefanikiwa. Hakuna usomaji uliokwama. Kagua kumbukumbu za kuendelea, kuingiza safu mlalo au kuandika.|Les trois lectures ont réussi. Le blocage ne s’est pas reproduit. Consultez le journal pour la reprise, l’insertion de lignes ou l’écriture.
结论：少量行读取成功，整列范围读取失败；优先检查大范围读取和目标表处理负担，单次结果尚不能证明具体根因。|The short read succeeded and the full-column read failed. Check the range size and destination workload first. A single run cannot establish the cause.|A leitura curta funcionou e a leitura das colunas inteiras falhou. Verifique o tamanho do intervalo e a carga no destino. Uma execução não determina a causa.|Usomaji mfupi umefanikiwa na usomaji wa safu wima nzima umeshindwa. Kagua ukubwa wa masafa na mzigo wa lahajedwali lengwa. Jaribio moja halithibitishi chanzo.|La lecture courte a réussi et celle des colonnes entières a échoué. Vérifiez d’abord la taille de la plage et la charge du classeur. Un seul essai ne suffit pas à établir la cause.
结论：基本信息或小范围读取已失败，暂不能将问题归为整列数据量过大。|Metadata or a short read failed. The data volume of full columns has not been established as the cause.|Os metadados ou uma leitura curta falharam. O volume de dados das colunas inteiras ainda não foi identificado como causa.|Taarifa za msingi au usomaji mfupi umeshindwa. Kiasi cha data katika safu wima nzima hakijathibitishwa kuwa chanzo.|La lecture des métadonnées ou d’une petite plage a échoué. Le volume des colonnes entières n’a pas été établi comme cause.
HTTP 503：Google 服务端暂时无法处理此请求；可能是服务异常或表格、请求复杂度较高，不是权限拒绝的证据。|HTTP 503: Google temporarily cannot process the request. Possible causes include a service issue or spreadsheet or request complexity. This status does not indicate denied access.|HTTP 503: o Google não pode processar a solicitação temporariamente. Pode ser uma falha de serviço ou complexidade da planilha ou solicitação. O código não indica acesso negado.|HTTP 503: Google haiwezi kushughulikia ombi kwa sasa. Huenda kuna hitilafu ya huduma au ugumu wa lahajedwali au ombi. Hali hii haionyeshi kukataliwa kwa ruhusa.|HTTP 503 : Google ne peut temporairement pas traiter la requête. Le service, la complexité du classeur ou celle de la requête peuvent être en cause. Ce code ne signale pas un refus d’accès.
HTTP 403：请求被拒绝，请检查 API 是否启用及扩展实际授权账号的访问权限。|HTTP 403: request denied. Check API activation and the permissions of the Google account authorized in the extension.|HTTP 403: solicitação negada. Verifique a ativação da API e as permissões da conta do Google autorizada na extensão.|HTTP 403: ombi limekataliwa. Hakikisha API imewashwa na kagua ruhusa za akaunti ya Google iliyoidhinisha kiendelezi.|HTTP 403 : requête refusée. Vérifiez l’activation de l’API et les droits du compte Google autorisé dans l’extension.
HTTP 404：表格不存在或当前授权账号无法访问，请核对目标网址和账号。|HTTP 404: the spreadsheet is missing or inaccessible to the authorized account. Check the URL and account.|HTTP 404: a planilha não existe ou não está acessível para a conta autorizada. Confira o URL e a conta.|HTTP 404: lahajedwali halipo au akaunti iliyoidhinishwa haiwezi kulifikia. Kagua URL na akaunti.|HTTP 404 : classeur introuvable ou inaccessible au compte autorisé. Vérifiez l’URL et le compte.
HTTP 429：请求受到限流，请稍后再测，避免反复点击。|HTTP 429: too many requests. Wait before trying again.|HTTP 429: solicitações demais. Aguarde antes de tentar de novo.|HTTP 429: maombi mengi mno. Subiri kabla ya kujaribu tena.|HTTP 429 : trop de requêtes. Patientez avant de réessayer.
已停止后续数据探测，没有自动重试失败请求。|Further checks stopped. Failed requests were not retried automatically.|As verificações seguintes foram interrompidas. Solicitações com falha não foram repetidas automaticamente.|Ukaguzi zaidi umesimamishwa. Maombi yaliyoshindwa hayakujaribiwa tena kiotomatiki.|Les vérifications suivantes ont été arrêtées. Les requêtes en échec n’ont pas été relancées automatiquement.
源选区解析为 {0} 行、{1} 个非空单元格。|Parsed the selection: {0} rows and {1} nonempty cells.|Seleção processada: {0} linhas e {1} células não vazias.|Sehemu iliyochaguliwa imechanganuliwa: safu mlalo {0} na visanduku {1} vyenye data.|Sélection analysée : {0} lignes et {1} cellules non vides.
本次执行完成，用时 {0}。|Run completed in {0:t}.|Execução concluída em {0:t}.|Utekelezaji umekamilika baada ya {0:t}.|Exécution terminée en {0:t}.
本次执行中断，已用时 {0}。|Run interrupted after {0:t}.|Execução interrompida após {0:t}.|Utekelezaji umekatizwa baada ya {0:t}.|Exécution interrompue après {0:t}.
尚未填写地区配置分表名称。|The region settings tab name is missing.|O nome da aba de configuração regional está faltando.|Jina la kichupo cha mipangilio ya maeneo halijawekwa.|Le nom de l’onglet des paramètres régionaux est manquant.
专用地区配置需要首行表头及至少一条国家数据。|Team-specific region settings require a header row and at least one country entry.|A configuração regional da equipe exige um cabeçalho e pelo menos um país.|Mipangilio ya maeneo ya timu inahitaji safu mlalo ya kichwa na angalau nchi moja.|Les paramètres régionaux de l’équipe nécessitent une ligne d’en-tête et au moins un pays.
默认分表|default tab|aba padrão|kichupo chaguo-msingi|onglet par défaut
请配置有效的目标 Google 表格网址。|Configure a valid destination Google Sheets URL.|Configure um URL de destino válido do Google Planilhas.|Weka URL halali ya Majedwali ya Google lengwa.|Configurez une URL Google Sheets de destination valide.
尚未填写 E 列状态，请先在右侧配置。|Set the column E status in Configuration first.|Defina o status da coluna E na configuração.|Weka hali ya safu wima E katika mipangilio kwanza.|Définissez d’abord le statut de la colonne E dans la configuration.
尚未选择 A 列日期/时间，请先在右侧配置。|Select a date or time for column A in Configuration first.|Selecione a data ou hora da coluna A na configuração.|Chagua tarehe au muda wa safu wima A katika mipangilio kwanza.|Sélectionnez d’abord une date ou une heure pour la colonne A dans la configuration.
已取消本次转交，未写入任何数据。|Transfer canceled. No data was written.|Transferência cancelada. Nenhum dado foi gravado.|Uhamisho umeghairiwa. Hakuna data iliyoandikwa.|Transfert annulé. Aucune donnée n’a été écrite.
使用当前队伍的专用地区配置。|Using this team’s region settings.|Usando a configuração regional desta equipe.|Inatumia mipangilio ya maeneo ya timu hii.|Utilisation des paramètres régionaux de cette équipe.
正在同步地区配置分表“{0}”（每天最多检查一次）。|Syncing region settings from “{0}” (at most one check per day).|Sincronizando a configuração regional de “{0}” (no máximo uma verificação por dia).|Inasawazisha mipangilio ya maeneo kutoka “{0}” (ukaguzi mmoja kwa siku au chini).|Synchronisation des paramètres régionaux depuis « {0} » (au plus une vérification par jour).
正在根据 Q{0}:Q{1} 的国际区号补全 V 列。|Filling column V using international dialing codes in Q{0}:Q{1}.|Preenchendo a coluna V com códigos internacionais de Q{0}:Q{1}.|Inajaza safu wima V kwa kutumia misimbo ya kimataifa ya simu katika Q{0}:Q{1}.|Complétion de la colonne V à partir des indicatifs internationaux dans Q{0}:Q{1}.
Q 列区号处理完成，补全 V 列 {0} 个空单元格。|Processed dialing codes in Q and filled {0} empty cells in V.|Códigos em Q processados, com {0} células vazias preenchidas em V.|Misimbo ya simu katika Q imechakatwa na visanduku tupu {0} katika V vimejazwa.|Indicatifs en Q traités et {0} cellules vides remplies en V.
正在逐行调用 {0}（{1}）拆解 AL{2}:AL{3}。|Using {0} ({1}) to analyze AL{2}:AL{3} row by row.|Usando {0} ({1}) para analisar AL{2}:AL{3} linha por linha.|Inatumia {0} ({1}) kuchanganua AL{2}:AL{3} safu mlalo moja baada ya nyingine.|Analyse de AL{2}:AL{3} ligne par ligne avec {0} ({1}).
报告拆解完成：分析 {0} 行，回写 {1} 个字段。|Report analysis completed: {0} rows analyzed and {1} fields updated.|Análise concluída: {0} linhas analisadas e {1} campos atualizados.|Uchanganuzi umekamilika: safu mlalo {0} zimechanganuliwa na sehemu {1} zimesasishwa.|Analyse terminée : {0} lignes analysées et {1} champs mis à jour.
报告拆解完成：分析 {0} 行，回写 {1} 个字段；失败 {2} 行（第 {3} 行），其余步骤继续。|Report analysis completed: {0} rows analyzed, {1} fields updated. {2} failures (rows {3}). Continuing with the remaining steps.|Análise concluída: {0} linhas analisadas e {1} campos atualizados. {2} falhas (linhas {3}). As etapas restantes continuam.|Uchanganuzi umekamilika: safu mlalo {0} zimechanganuliwa na sehemu {1} zimesasishwa. Hitilafu {2} (safu mlalo {3}). Hatua zilizobaki zinaendelea.|Analyse terminée : {0} lignes analysées et {1} champs mis à jour. {2} échecs (lignes {3}). Les étapes restantes se poursuivent.
没有需要重跑的失败行。|There are no failed rows to retry.|Não há linhas com falha para reprocessar.|Hakuna safu mlalo zilizoshindwa zinazohitaji jaribio jipya.|Aucune ligne en échec à relancer.
请先在参数配置里填写目标表格网址和分表名称。|Enter the destination URL and tab name in Configuration first.|Informe primeiro o URL e o nome da aba de destino na configuração.|Weka URL na jina la kichupo lengwa katika mipangilio kwanza.|Renseignez d’abord l’URL et le nom de l’onglet de destination dans la configuration.
失败行均在当前表头范围内，已跳过。|All failed rows are within the current headers and were skipped.|Todas as linhas com falha estão no cabeçalho atual e foram ignoradas.|Safu mlalo zote zilizoshindwa ziko ndani ya kichwa cha sasa na zimerukwa.|Toutes les lignes en échec sont dans les en-têtes actuels et ont été ignorées.
失败队列已清空。|The failed-row queue has been cleared.|A fila de linhas com falha foi esvaziada.|Foleni ya safu mlalo zilizoshindwa imefutwa.|La file des lignes en échec a été vidée.
重跑失败：{0}|Retry failed: {0:t}|Falha na nova tentativa: {0:t}|Jaribio jipya limeshindwa: {0:t}|Échec de la relance : {0:t}
{0} API 请求失败（HTTP {1}）。|{0} API request failed (HTTP {1}).|Falha na solicitação à API {0} (HTTP {1}).|Ombi la API ya {0} limeshindwa (HTTP {1}).|Échec de la requête à l’API {0} (HTTP {1}).
Google Sheets API 请求失败（HTTP {0}）。|Google Sheets API request failed (HTTP {0}).|Falha na solicitação à API Google Planilhas (HTTP {0}).|Ombi la API ya Majedwali ya Google limeshindwa (HTTP {0}).|Échec de la requête à l’API Google Sheets (HTTP {0}).
目标分表设置未返回。|The destination tab settings were not returned.|As configurações da aba de destino não foram retornadas.|Mipangilio ya kichupo lengwa haikurudishwa.|Les paramètres de l’onglet de destination n’ont pas été renvoyés.
转交 {0} 行 · V 列补全 {1} 格 · AL 拆解成功 {2}/{3}|Transferred {0} rows · Filled {1} cells in V · AL analysis succeeded for {2}/{3}|{0} linhas transferidas · {1} células preenchidas em V · {2}/{3} análises bem-sucedidas em AL|Safu mlalo {0} zimehamishwa · Visanduku {1} vimejazwa katika V · Uchanganuzi wa AL umefanikiwa kwa {2}/{3}|{0} lignes transférées · {1} cellules complétées en V · {2}/{3} analyses réussies en AL
目标|Destination|Destino|Lengwa|Destination
源|Source|Origem|Chanzo|Source
(空)|(empty)|(vazio)|(tupu)|(vide)
没有解析到非空内容，请回 A 表重新复制后再试。|No data found. Copy the selection again from source sheet A.|Nenhum dado encontrado. Copie novamente a seleção da planilha A.|Hakuna data iliyopatikana. Nakili tena sehemu iliyochaguliwa katika lahajedwali A.|Aucune donnée trouvée. Copiez à nouveau la sélection depuis la feuille A.
按组别2固定列映射解析到 {0} 个非空行 × {1} 个目标列。|Team 2 mapping: {0} nonempty rows × {1} destination columns.|Mapeamento da equipe 2: {0} linhas não vazias × {1} colunas de destino.|Mpangilio wa timu 2: safu mlalo {0} zenye data × safu wima lengwa {1}.|Correspondance de l’équipe 2 : {0} lignes non vides × {1} colonnes de destination.
解析到 {0} 个非空行 × {1} 列；当前按“源 {2} 列 → 目标 C 列”对齐。|Parsed {0} nonempty rows × {1} columns. Source column {2} aligns with destination column C.|Foram processadas {0} linhas não vazias × {1} colunas. A coluna de origem {2} é alinhada à coluna C de destino.|Safu mlalo {0} zenye data × safu wima {1} zimechanganuliwa. Safu wima chanzo {2} inalingana na safu wima lengwa C.|{0} lignes non vides × {1} colonnes analysées. La colonne source {2} correspond à la colonne C de destination.
目标表格网址中没有找到 Spreadsheet ID。|The destination URL is missing a spreadsheet ID.|O URL de destino não contém o ID da planilha.|URL lengwa haina kitambulisho cha lahajedwali.|L’URL de destination ne contient pas l’identifiant du classeur.
Google 授权回调地址不正确。|Invalid Google authorization callback URL.|URL de retorno da autorização do Google inválido.|URL ya kurudi ya idhini ya Google si halali.|URL de retour de l’autorisation Google invalide.
Google 授权请求校验失败，请重新授权。|Could not verify the Google authorization request. Authorize again.|Não foi possível validar a autorização do Google. Autorize novamente.|Ombi la idhini ya Google halijathibitishwa. Toa idhini tena.|Impossible de vérifier la demande d’autorisation Google. Autorisez de nouveau.
Google 网页授权未完成，请重新授权。|Google web authorization did not complete. Authorize again.|A autorização do Google pela web não foi concluída. Autorize novamente.|Idhini ya Google kupitia wavuti haikukamilika. Toa idhini tena.|L’autorisation Google sur le Web est incomplète. Autorisez de nouveau.
Google 授权页面没有返回有效的访问令牌。|Google did not return a valid access token.|O Google não retornou um token de acesso válido.|Google haikurudisha tokeni halali ya ufikiaji.|Google n’a pas renvoyé de jeton d’accès valide.
Google 授权失败。|Google authorization failed.|A autorização do Google falhou.|Idhini ya Google imeshindwa.|L’autorisation Google a échoué.
Google 授权失败：{0}。|Google authorization failed: {0:t}.|Falha na autorização do Google: {0:t}.|Idhini ya Google imeshindwa: {0:t}.|Échec de l’autorisation Google : {0:t}.
{0} 如果没有弹窗，请检查浏览器是否拦截了扩展授权窗口。|{0:t} If no window appeared, check whether your browser blocked it.|{0:t} Se nenhuma janela apareceu, verifique se o navegador a bloqueou.|{0:t} Ikiwa dirisha halikutokea, angalia kama kivinjari kililizuia.|{0:t} Si aucune fenêtre ne s’est ouverte, vérifiez si le navigateur l’a bloquée.
浏览器内建授权不可用（{0}），改用网页授权窗口。若每次都这样，请检查浏览器是否已登录 Google 账号。|Browser authorization is unavailable ({0}). Opening web authorization. If this recurs, check that you are signed in to Google in the browser.|Autorização do navegador indisponível ({0}). Abrindo autorização pela web. Se isso se repetir, confira se você está conectado ao Google.|Idhini ya kivinjari haipatikani ({0}). Inafungua idhini ya wavuti. Hali hii ikijirudia, hakikisha umeingia kwenye Google.|Autorisation du navigateur indisponible ({0}). Ouverture de l’autorisation Web. Si cela se reproduit, vérifiez que vous êtes connecté à Google.
续传发现 {0} 个冲突单元格（{1}）。请先核对目标区域 {2}。继续会覆盖冲突内容，是否继续？|Resume detected {0} conflicting cells ({1}). Check destination range {2}. Continuing will overwrite the conflicts. Continue?|A retomada encontrou {0} células em conflito ({1}). Confira o intervalo {2}. Continuar substituirá os dados em conflito. Continuar?|Kuendelea kumeonyesha visanduku {0} vinavyokinzana ({1}). Kagua masafa {2}. Kuendelea kutafuta data inayokinzana na kuandika mpya. Uendelee?|La reprise a détecté {0} cellules en conflit ({1}). Vérifiez la plage {2}. Continuer écrasera les données en conflit. Continuer ?
确认覆盖并继续|Overwrite and continue|Substituir e continuar|Andika juu ya data na uendelee|Écraser et continuer
已取消续传。续传记录已保留。|Resume canceled. The resume record was kept.|Retomada cancelada. O registro foi mantido.|Kuendelea kumeghairiwa. Rekodi imehifadhiwa.|Reprise annulée. Le point de reprise a été conservé.
确认期间目标区域有变化。请重新开始续传并核对冲突。|The destination changed during confirmation. Restart the resume process and check the conflicts.|O destino mudou durante a confirmação. Reinicie a retomada e confira os conflitos.|Masafa lengwa yamebadilika wakati wa uthibitisho. Anzisha tena kuendelea na ukague migongano.|La destination a changé pendant la confirmation. Relancez la reprise et vérifiez les conflits.
上次转交的写入位置现在属于表头。请先调整表头设置，再继续上次转交。|The previous write position is now inside the header. Adjust the header settings before resuming.|A posição anterior de gravação agora está no cabeçalho. Ajuste o cabeçalho antes de retomar.|Mahali pa kuandika awali sasa pako ndani ya kichwa. Rekebisha mipangilio ya kichwa kabla ya kuendelea.|La position d’écriture précédente est maintenant dans l’en-tête. Ajustez les paramètres d’en-tête avant de reprendre.
上次断点记录的行数与当前解析结果不一致。请先核对选区和目标表。|The saved row count differs from the current selection. Check the selection and destination.|O número de linhas salvo difere da seleção atual. Confira a seleção e o destino.|Idadi ya safu mlalo iliyohifadhiwa inatofautiana na chaguo la sasa. Kagua chaguo na lengwa.|Le nombre de lignes enregistré diffère de la sélection actuelle. Vérifiez la sélection et la destination.
源选区没有读到 B:BL 内容，请确认选择整行后按 Ctrl+C。|No B:BL data was found. Select entire rows and press Ctrl+C.|Nenhum dado encontrado em B:BL. Selecione linhas inteiras e pressione Ctrl+C.|Hakuna data katika B:BL. Chagua safu mlalo nzima na ubonyeze Ctrl+C.|Aucune donnée dans B:BL. Sélectionnez des lignes entières et appuyez sur Ctrl+C.
已核验上次转交区域 {0}，继续剩余步骤。|Verified the previous transfer range {0}. Continuing the remaining steps.|Intervalo anterior {0} verificado. Continuando as etapas restantes.|Masafa ya awali {0} yamethibitishwa. Hatua zilizobaki zinaendelea.|Plage de transfert précédente {0} vérifiée. Les étapes restantes se poursuivent.
拿不到分表 ID，无法增加目标表行数。|Unable to add rows: the destination tab ID is missing.|Não foi possível adicionar linhas: falta o ID da aba de destino.|Safu mlalo haziwezi kuongezwa: kitambulisho cha kichupo lengwa hakipo.|Impossible d’ajouter des lignes : identifiant de l’onglet de destination manquant.
拿不到分表 ID，无法在数据块前增加行。|The tab ID is missing, so rows cannot be inserted before the data.|Falta o ID da aba para inserir linhas antes dos dados.|Kitambulisho cha kichupo hakipo, hivyo safu mlalo haziwezi kuingizwa kabla ya data.|Impossible d’insérer des lignes avant les données : identifiant de l’onglet manquant.
配置文件格式或版本不正确。|Invalid configuration file format or version.|Formato ou versão do arquivo de configuração inválidos.|Umbizo au toleo la faili ya mipangilio si halali.|Format ou version du fichier de configuration invalide.
配置字段格式不正确。|Invalid configuration field format.|Formato de campo de configuração inválido.|Umbizo la sehemu ya mipangilio si halali.|Format de champ de configuration invalide.
组别配置不正确。|Invalid team setting.|Configuração de equipe inválida.|Mpangilio wa timu si halali.|Paramètre d’équipe invalide.
目标 Google 表格网址不正确。|Invalid destination Google Sheets URL.|URL de destino do Google Planilhas inválido.|URL ya Majedwali ya Google lengwa si halali.|URL Google Sheets de destination invalide.
目标表头行数配置不正确。|Invalid destination header row count.|Número inválido de linhas de cabeçalho de destino.|Idadi ya safu mlalo za kichwa si halali.|Nombre de lignes d’en-tête de destination invalide.
配置文件超过 256 KB，请检查文件是否正确。|The configuration file exceeds 256 KB. Check that you selected the right file.|O arquivo de configuração excede 256 KB. Verifique se selecionou o arquivo correto.|Faili ya mipangilio inazidi KB 256. Hakikisha umechagua faili sahihi.|Le fichier de configuration dépasse 256 Ko. Vérifiez que vous avez choisi le bon fichier.
配置导入失败：{0}|Configuration import failed: {0:t}|Falha ao importar a configuração: {0:t}|Imeshindikana kuingiza mipangilio: {0:t}|Échec de l’importation de la configuration : {0:t}
请在参数配置中填写有效的目标表头行数（非负整数），或留空使用默认值 2。|Enter a valid header row count (a nonnegative integer), or leave it blank to use 2.|Informe um número válido de linhas de cabeçalho (inteiro não negativo) ou deixe em branco para usar 2.|Weka idadi halali ya safu mlalo za kichwa (namba kamili isiyo hasi), au acha wazi kutumia 2.|Saisissez un nombre de lignes d’en-tête valide (entier positif ou nul), ou laissez vide pour utiliser 2.
请填写有效的目标表头行数（非负整数），或留空使用默认值 2。|Enter a valid header row count (a nonnegative integer), or leave it blank to use 2.|Informe um número válido de linhas de cabeçalho (inteiro não negativo) ou deixe em branco para usar 2.|Weka idadi halali ya safu mlalo za kichwa (namba kamili isiyo hasi), au acha wazi kutumia 2.|Saisissez un nombre de lignes d’en-tête valide (entier positif ou nul), ou laissez vide pour utiliser 2.
尚未配置 {0} API Key，请在设置中填写并保存。|Enter and save the {0} API key in settings.|Digite e salve a chave da API {0} nas configurações.|Weka na uhifadhi ufunguo wa API ya {0} katika mipangilio.|Saisissez et enregistrez la clé API {0} dans les paramètres.
{0} API 返回异常。|The {0} API returned an invalid response.|A API {0} retornou uma resposta inválida.|API ya {0} imerudisha jibu lisilo halali.|L’API {0} a renvoyé une réponse invalide.
找不到目标分表“{0}”。|Destination tab “{0}” was not found.|A aba de destino “{0}” não foi encontrada.|Kichupo lengwa “{0}” hakijapatikana.|L’onglet de destination « {0} » est introuvable.
没有找到目标分表“{0}”，已停止自动粘贴，避免贴错表。|Destination tab “{0}” was not found. Automatic paste was stopped to avoid using the wrong tab.|A aba de destino “{0}” não foi encontrada. A colagem automática foi interrompida para evitar colar na aba errada.|Kichupo lengwa “{0}” hakijapatikana. Ubandikaji otomatiki umesimamishwa ili kuepuka kichupo kisicho sahihi.|L’onglet « {0} » est introuvable. Le collage automatique a été arrêté pour éviter de coller dans le mauvais onglet.
目标表粘贴失败，请手动选择首个空行后按 Ctrl+V。|Paste failed. Select the first empty row and press Ctrl+V.|A colagem falhou. Selecione a primeira linha vazia e pressione Ctrl+V.|Ubandikaji umeshindwa. Chagua safu mlalo ya kwanza iliyo tupu na ubonyeze Ctrl+V.|Le collage a échoué. Sélectionnez la première ligne vide et appuyez sur Ctrl+V.
无法安全读取待转交内容。|Could not safely read the pending transfer.|Não foi possível ler com segurança a transferência pendente.|Imeshindikana kusoma kwa usalama data inayosubiri kuhamishwa.|Impossible de lire en toute sécurité le transfert en attente.
扩展安全边界不可用，请重新加载扩展后重试。|The extension’s storage protection is unavailable. Reload the extension and try again.|A proteção de armazenamento da extensão está indisponível. Recarregue a extensão e tente novamente.|Ulinzi wa hifadhi ya kiendelezi haupatikani. Pakia kiendelezi upya na ujaribu tena.|La protection du stockage de l’extension est indisponible. Rechargez l’extension, puis réessayez.
复制失败|Copy failed|Falha ao copiar|Kunakili kumeshindwa|Échec de la copie
有一个下拉菜单的来源范围无法读取（HTTP 400），请检查目标表的数据验证规则。|A dropdown source range could not be read (HTTP 400). Check the destination’s data validation rules.|Não foi possível ler o intervalo de origem de uma lista (HTTP 400). Confira as regras de validação do destino.|Masafa chanzo ya orodha hayakusomeka (HTTP 400). Kagua sheria za uthibitishaji wa data lengwa.|Une plage source de liste déroulante est illisible (HTTP 400). Vérifiez les règles de validation de la destination.
检测到 W/X/Y 下拉选项缺失，但没有地区配置分表名，无法自动修复。|W/X/Y dropdown options are missing. Set the region tab name to enable automatic repair.|Faltam opções nas listas W/X/Y. Configure o nome da aba regional para permitir o reparo automático.|Chaguo za W/X/Y hazipo. Weka jina la kichupo cha maeneo ili kuwezesha urekebishaji otomatiki.|Des options W/X/Y manquent. Renseignez l’onglet régional pour activer la correction automatique.
找不到目标分表“{0}”的 ID|Could not find the ID of destination tab “{0}”|ID da aba de destino “{0}” não encontrado|Kitambulisho cha kichupo lengwa “{0}” hakikupatikana|Identifiant de l’onglet « {0} » introuvable
已更新当前批次的 {0} 下拉菜单。|Updated the {0} dropdowns for this batch.|Listas {0} deste lote atualizadas.|Orodha za {0} za kundi hili zimesasishwa.|Listes {0} mises à jour pour ce lot.
W/X/Y 下拉菜单自动修复失败，保留原流程：{0}|Automatic W/X/Y dropdown repair failed. Continuing as before: {0:t}|Falha ao reparar as listas W/X/Y. Continuando o fluxo original: {0:t}|Urekebishaji otomatiki wa orodha za W/X/Y umeshindwa. Mchakato wa awali unaendelea: {0:t}|Échec de la correction automatique des listes W/X/Y. Le processus initial continue : {0:t}
读取 Q 列号码失败：{0}|Could not read phone numbers in Q: {0:t}|Não foi possível ler os números em Q: {0:t}|Nambari za simu katika Q hazikusomeka: {0:t}|Impossible de lire les numéros en Q : {0:t}
读取 V 列现有值失败：{0}|Could not read existing values in V: {0:t}|Não foi possível ler os valores existentes em V: {0:t}|Thamani zilizopo katika V hazikusomeka: {0:t}|Impossible de lire les valeurs existantes en V : {0:t}
读取 V:Y 下拉规则失败：{0}|Could not read dropdown rules for V:Y: {0:t}|Não foi possível ler as regras das listas em V:Y: {0:t}|Sheria za orodha katika V:Y hazikusomeka: {0:t}|Impossible de lire les règles des listes en V:Y : {0:t}
写入 V 列区号国家失败：{0}|Could not write the dialing-code country to V: {0:t}|Não foi possível gravar em V o país do código: {0:t}|Nchi ya msimbo wa simu haikuandikwa katika V: {0:t}|Impossible d’écrire en V le pays de l’indicatif : {0:t}
V 列下拉来源无法校验，已跳过 V 列补全，继续拆解 AL 报告。|The column V dropdown source could not be verified. Skipping V and continuing with AL report analysis.|Não foi possível verificar a origem da lista em V. Ignorando V e continuando a análise em AL.|Chanzo cha orodha ya V hakikuthibitishwa. V imerukwa na uchanganuzi wa AL unaendelea.|La source de la liste en V n’a pas pu être vérifiée. La colonne V est ignorée et l’analyse en AL se poursuit.
第 {0} 行 Q 区号处理：{1}。|Row {0}, Q dialing code: {1:t}.|Linha {0}, código em Q: {1:t}.|Safu mlalo {0}, msimbo wa simu katika Q: {1:t}.|Ligne {0}, indicatif en Q : {1:t}.
已匹配|matched|encontrado|imelingana|correspondance trouvée
未匹配|no match|sem correspondência|hakuna ulinganifu|aucune correspondance
已识别|identified|identificado|imetambuliwa|identifié
未识别|unidentified|não identificado|haijatambuliwa|non identifié
已匹配配置|matched settings|configuração encontrada|imelingana na mipangilio|correspondance trouvée dans les paramètres
待核实|pending verification|a verificar|inasubiri uhakiki|à vérifier
{0} 返回内容中没有找到有效 JSON。|{0} did not return valid JSON.|{0} não retornou JSON válido.|{0} haikurudisha JSON halali.|{0} n’a pas renvoyé de JSON valide.
{0} 返回的 JSON 不完整。|{0} returned incomplete JSON.|{0} retornou JSON incompleto.|{0} imerudisha JSON isiyokamilika.|{0} a renvoyé un JSON incomplet.
{0} 返回的报告 JSON 格式无效。|{0} returned an invalid report JSON format.|{0} retornou um relatório em formato JSON inválido.|{0} imerudisha ripoti yenye umbizo la JSON lisilo halali.|{0} a renvoyé un rapport au format JSON invalide.
{0} 模型请求完成，用时 {1}。|{0} model request completed in {1:t}.|Solicitação do modelo {0} concluída em {1:t}.|Ombi la modeli {0} limekamilika baada ya {1:t}.|Requête au modèle {0} terminée en {1:t}.
{0} 模型请求失败，用时 {1}。|{0} model request failed after {1:t}.|A solicitação do modelo {0} falhou após {1:t}.|Ombi la modeli {0} limeshindwa baada ya {1:t}.|Échec de la requête au modèle {0} après {1:t}.
{0} 第一次返回不是合法 JSON，已附加严格格式要求重试一次。|{0} first returned invalid JSON. Retrying once with strict format instructions.|A primeira resposta de {0} tinha JSON inválido. Tentando mais uma vez com formato estrito.|Jibu la kwanza la {0} halikuwa JSON halali. Inajaribu tena mara moja kwa masharti madhubuti ya umbizo.|La première réponse de {0} contenait du JSON invalide. Nouvelle tentative avec des consignes de format strictes.
{0} 严格 JSON 重试完成，用时 {1}。|{0} strict JSON retry completed in {1:t}.|Nova tentativa com JSON estrito de {0} concluída em {1:t}.|Jaribio la JSON kwa umbizo madhubuti la {0} limekamilika baada ya {1:t}.|Nouvelle tentative JSON stricte de {0} terminée en {1:t}.
已读取目标下拉选项：W={0}，X={1}，Y={2}。|Loaded destination dropdown options: W={0}, X={1}, Y={2}.|Opções das listas carregadas: W={0}, X={1}, Y={2}.|Chaguo za orodha lengwa zimepakiwa: W={0}, X={1}, Y={2}.|Options des listes chargées : W={0}, X={1}, Y={2}.
第 {0} 行 AL 列为空，跳过。|Row {0}: AL is empty. Skipping.|Linha {0}: AL está vazia. Ignorando.|Safu mlalo {0}: AL ni tupu. Inarukwa.|Ligne {0} : AL est vide. Ligne ignorée.
第 {0} 行报告拆解失败，已跳过该行：{1}|Report analysis failed on row {0}. Row skipped: {1:t}|A análise falhou na linha {0}, que foi ignorada: {1:t}|Uchanganuzi umeshindwa kwenye safu mlalo {0}, ambayo imerukwa: {1:t}|Échec de l’analyse à la ligne {0}, qui a été ignorée : {1:t}
第 {0} 行地址有多个同名配置路径，缺少上级信息；市区不自动写入，等待核实。|Row {0}: several configured paths share this address name. The parent area is missing. The city will be left blank pending verification.|Linha {0}: várias hierarquias têm o mesmo nome. Falta a região superior. A cidade fica em branco até verificação.|Safu mlalo {0}: maeneo kadhaa katika mipangilio yana jina moja. Eneo la ngazi ya juu halipo. Mji utaachwa wazi hadi uhakiki.|Ligne {0} : plusieurs hiérarchies ont le même nom. La zone parente manque. La ville restera vide en attendant une vérification.
第 {0} 行配置归属核对失败，保持未确认层级为空：{1}|Row {0}: could not verify the address hierarchy. Unconfirmed levels stay blank: {1:t}|Linha {0}: não foi possível verificar a hierarquia do endereço. Níveis não confirmados ficam em branco: {1:t}|Safu mlalo {0}: mpangilio wa anwani haukuthibitishwa. Ngazi zisizothibitishwa zinaachwa wazi: {1:t}|Ligne {0} : impossible de vérifier la hiérarchie de l’adresse. Les niveaux non confirmés restent vides : {1:t}
第 {0} 行地址已匹配配置（{1}）。|Row {0}: address matched the settings ({1:t}).|Linha {0}: endereço encontrado na configuração ({1:t}).|Safu mlalo {0}: anwani imelingana na mipangilio ({1:t}).|Ligne {0} : adresse trouvée dans les paramètres ({1:t}).
AI封闭配置核对|AI check against configured entries|Verificação por IA com as entradas configuradas|Ukaguzi wa AI kwa chaguo zilizowekwa|Vérification par IA des entrées configurées
配置精确/别名|exact match or alias|Correspondência exata ou alias|Ulinganifu kamili au jina mbadala|Correspondance exacte ou alias
配置拼写容错|spelling-tolerant match|Correspondência com tolerância ortográfica|Ulinganifu unaovumilia tofauti za tahajia|Correspondance avec tolérance orthographique
推断字段/{0}|Inferred field / {0:t}|Campo inferido / {0:t}|Sehemu iliyokadiriwa / {0:t}|Champ déduit / {0:t}
第 {0} 行字段处理完成：年龄{1}，职业{2}，地址{3}，类别{4}。|Row {0} processed: age {1:t}, occupation {2:t}, address {3:t}, category {4:t}.|Linha {0} processada: idade {1:t}, profissão {2:t}, endereço {3:t}, categoria {4:t}.|Safu mlalo {0} imechakatwa: umri {1:t}, kazi {2:t}, anwani {3:t}, aina {4:t}.|Ligne {0} traitée : âge {1:t}, profession {2:t}, adresse {3:t}, catégorie {4:t}.
已先将 {0} 个 AA 地址拆解卡片写入目标表。|Wrote {0} address breakdowns to AA first.|Foram gravadas primeiro {0} análises de endereço em AA.|Michanganuo ya anwani {0} imeandikwa kwanza katika AA.|{0} analyses d’adresse ont d’abord été écrites en AA.
已根据 AA 拆解结果补全 {0} 个字段；W/X/Y 仅写入下拉选项。|Filled {0} fields using AA analysis. W/X/Y accept dropdown options only.|Foram preenchidos {0} campos com a análise de AA. W/X/Y recebem apenas opções das listas.|Sehemu {0} zimejazwa kwa uchanganuzi wa AA. W/X/Y hupokea chaguo za orodha pekee.|{0} champs complétés avec l’analyse de AA. W/X/Y ne reçoivent que les options des listes.
Google Sheets API 尚未启用。请在 Google Cloud 项目 357885944577 中启用 Sheets API，等待几分钟后重试。|Enable the Sheets API in Google Cloud project 357885944577, wait a few minutes, then try again.|Ative a API Sheets no projeto 357885944577 do Google Cloud, aguarde alguns minutos e tente novamente.|Washa API ya Sheets katika mradi wa Google Cloud 357885944577, subiri dakika chache na ujaribu tena.|Activez l’API Sheets dans le projet Google Cloud 357885944577, attendez quelques minutes, puis réessayez.
Google Sheets API 服务暂时不可用（HTTP 503）；可能是临时服务异常或请求、表格复杂度较高。|Google Sheets API temporarily unavailable (HTTP 503). The service may be down, or the request or spreadsheet may be too complex.|API Google Planilhas temporariamente indisponível (HTTP 503). Pode haver uma falha no serviço ou complexidade na solicitação ou planilha.|API ya Majedwali ya Google haipatikani kwa muda (HTTP 503). Huenda huduma ina hitilafu au ombi au lahajedwali lina utata mwingi.|API Google Sheets temporairement indisponible (HTTP 503). Le service, la complexité de la requête ou celle du classeur peuvent être en cause.
目标表基本信息及条件格式|destination metadata and conditional formatting|metadados e formatação condicional do destino|taarifa za msingi na umbizo la masharti la lengwa|métadonnées et mise en forme conditionnelle de la destination
目标分表 A:BM（定位最上面数据行）|destination A:BM (locating the first data row)|destino A:BM (localizando a primeira linha de dados)|lengwa A:BM (kutafuta safu mlalo ya kwanza yenye data)|destination A:BM (recherche de la première ligne de données)
上次转交区域（续传核验）|previous transfer range (resume check)|intervalo da transferência anterior (verificação de retomada)|masafa ya uhamisho wa awali (ukaguzi wa kuendelea)|plage du transfert précédent (vérification de la reprise)
正在请求在目标表底部增加 {0} 行（尚未写入本次数据）。|Requesting {0} additional rows at the bottom. No transfer data has been written yet.|Solicitando {0} linhas adicionais no final. Os dados ainda não foram gravados.|Inaomba safu mlalo {0} zaidi mwishoni. Data ya uhamisho bado haijaandikwa.|Demande de {0} lignes supplémentaires en bas. Les données du transfert ne sont pas encore écrites.
目标表行数不足，已在底部增加 {0} 行。|Added {0} rows at the bottom of the destination.|Foram adicionadas {0} linhas no final do destino.|Safu mlalo {0} zimeongezwa mwishoni mwa lengwa.|{0} lignes ajoutées en bas de la destination.
正在请求在第 {0} 行前增加 {1} 行（尚未写入本次数据）。|Requesting {1} rows before row {0}. No transfer data has been written yet.|Solicitando {1} linhas antes da linha {0}. Os dados ainda não foram gravados.|Inaomba safu mlalo {1} kabla ya safu mlalo {0}. Data ya uhamisho bado haijaandikwa.|Demande de {1} lignes avant la ligne {0}. Les données du transfert ne sont pas encore écrites.
第 {0} 行前空位不足，已增加 {1} 行；按最上面数据行重新计算写入位置。|Added {1} rows because there was not enough room before row {0}. Recalculating the write position from the first data row.|Foram adicionadas {1} linhas por falta de espaço antes da linha {0}. Recalculando a posição de gravação a partir da primeira linha de dados.|Safu mlalo {1} zimeongezwa kwa sababu nafasi kabla ya safu mlalo {0} haitoshi. Mahali pa kuandika panakokotolewa upya kutoka safu mlalo ya kwanza yenye data.|{1} lignes ajoutées faute de place avant la ligne {0}. Recalcul de la position d’écriture à partir de la première ligne de données.
已确定写入位置：{0}!仅写入组别2配置列（按最上面数据行上方空位填充）。|Destination: {0}. Writing only Team 2’s mapped columns in the space above the first data row.|Destino: {0}. Gravando apenas as colunas mapeadas da equipe 2 acima da primeira linha de dados.|Lengwa: {0}. Safu wima zilizopangwa za timu 2 pekee zitaandikwa juu ya safu mlalo ya kwanza yenye data.|Destination : {0}. Seules les colonnes mappées de l’équipe 2 sont écrites au-dessus de la première ligne de données.
已确定写入区域：{0}（按最上面数据行上方空位填充）。|Write range: {0}, above the first data row.|Intervalo de gravação: {0}, acima da primeira linha de dados.|Masafa ya kuandika: {0}, juu ya safu mlalo ya kwanza yenye data.|Plage d’écriture : {0}, au-dessus de la première ligne de données.
已写入目标 C:BM 第 {0}～{1} 行。|Wrote to destination C:BM, rows {0}–{1}.|Gravado no destino C:BM, linhas {0}–{1}.|Data imeandikwa katika lengwa C:BM, safu mlalo {0}–{1}.|Écriture dans C:BM à destination, lignes {0}–{1}.
已将人员 ID 写入 I{0}:I{1}。|Wrote the personnel ID to I{0}:I{1}.|ID do colaborador gravado em I{0}:I{1}.|Kitambulisho cha mfanyakazi kimeandikwa katika I{0}:I{1}.|Identifiant du personnel écrit dans I{0}:I{1}.
未填写人员 ID，跳过 I 列写入。|No personnel ID was provided. Column I was skipped.|Nenhum ID foi informado. A coluna I foi ignorada.|Kitambulisho cha mfanyakazi hakikuwekwa. Safu wima I imerukwa.|Aucun identifiant du personnel renseigné. La colonne I a été ignorée.
已清空刚才写入行的 G{0}:G{1}。|Cleared G{0}:G{1} in the transferred rows.|Conteúdo de G{0}:G{1} limpo nas linhas transferidas.|G{0}:G{1} imefutwa katika safu mlalo zilizohamishwa.|G{0}:G{1} vidé dans les lignes transférées.
已将 E{0}:E{1} 设置为“{2}”。|Set E{0}:E{1} to “{2}”.|E{0}:E{1} definido como “{2}”.|E{0}:E{1} imewekwa kuwa “{2}”.|E{0}:E{1} défini sur « {2} ».
已将 C{0}:C{1} 设置为当天日期 {2}。|Set C{0}:C{1} to today’s date, {2}.|C{0}:C{1} definido com a data de hoje, {2}.|C{0}:C{1} imewekwa kuwa tarehe ya leo, {2}.|C{0}:C{1} défini sur la date du jour, {2}.
已将 A{0}:A{1} 设置为“{2}”。|Set A{0}:A{1} to “{2}”.|A{0}:A{1} definido como “{2}”.|A{0}:A{1} imewekwa kuwa “{2}”.|A{0}:A{1} défini sur « {2} ».
{0}：{1}。请重新复制选区后再开始转交。|{0:t}: {1}. Copy the selection again before restarting the transfer.|{0:t}: {1}. Copie a seleção novamente antes de reiniciar a transferência.|{0:t}: {1}. Nakili tena sehemu iliyochaguliwa kabla ya kuanzisha upya uhamisho.|{0:t} : {1}. Copiez à nouveau la sélection avant de relancer le transfert.
上次记录的写入区域现在是空的（可能已被手动删除），已清除续传记录|The previous write range is now empty and may have been cleared manually. The resume record was removed|O intervalo anterior está vazio e pode ter sido limpo manualmente. O registro de retomada foi removido|Masafa ya awali sasa hayana data na huenda yamefutwa kwa mkono. Rekodi ya kuendelea imeondolewa|La plage d’écriture précédente est vide et a pu être effacée manuellement. Le point de reprise a été supprimé
API 请求已返回，但回读目标范围为空|The API returned, but reading the destination returned an empty range|A API respondeu, mas a leitura do destino retornou um intervalo vazio|API imejibu, lakini masafa lengwa yamesomeka bila data|L’API a répondu, mais la plage de destination relue est vide
已自动识别组别2：按“从 {0} 列开始”处理，不弹出写入前确认。|Team 2 detected automatically. Starting at column {0} without opening the preview.|Equipe 2 detectada automaticamente. Iniciando na coluna {0} sem abrir a prévia.|Timu 2 imetambuliwa kiotomatiki. Inaanza katika safu wima {0} bila kufungua hakikisho.|Équipe 2 détectée automatiquement. Début en colonne {0} sans ouvrir l’aperçu.
已自动识别：整行复制、从 A 列开始对齐到目标 C 列（跳过写入前确认）。|Entire rows detected. Aligning source A with destination C and skipping the preview.|Linhas inteiras detectadas. Alinhando a origem A com o destino C, sem abrir a prévia.|Safu mlalo nzima zimetambuliwa. Chanzo A kinalinganishwa na lengwa C bila kufungua hakikisho.|Lignes entières détectées. La colonne source A est alignée sur la colonne C de destination sans aperçu.
旧版失败记录缺少目标表信息。请人工核对并处理这些行：{0}。记录已保留。|The older failure record lacks destination details. Verify and handle these rows manually: {0}. The record was kept.|O registro antigo não contém o destino. Verifique e trate manualmente as linhas {0}. O registro foi mantido.|Rekodi ya zamani haina taarifa za lengwa. Hakiki na ushughulikie safu mlalo {0} mwenyewe. Rekodi imehifadhiwa.|L’ancien relevé d’échec ne contient pas la destination. Vérifiez et traitez manuellement les lignes {0}. Le relevé a été conservé.
上次转交尚未完成。请点击「开始转交」继续，失败行重跑只处理已记录的 AL 拆解失败。|The previous transfer is incomplete. Select Start transfer to resume. Retry failed rows only handles recorded AL analysis failures.|A transferência anterior está incompleta. Selecione Iniciar transferência para retomar. O reprocessamento trata apenas falhas registradas na análise de AL.|Uhamisho wa awali haujakamilika. Chagua Anza uhamisho ili kuendelea. Jaribio jipya hushughulikia tu hitilafu zilizorekodiwa za uchanganuzi wa AL.|Le transfert précédent est incomplet. Cliquez sur Lancer le transfert pour reprendre. La relance traite uniquement les échecs d’analyse en AL enregistrés.
请切换回上次转交使用的目标表和分表后再重跑。|Switch back to the previous destination spreadsheet and tab before retrying.|Volte à planilha e à aba da transferência anterior antes de tentar novamente.|Rudi kwenye lahajedwali na kichupo vya uhamisho wa awali kabla ya kujaribu tena.|Rétablissez le classeur et l’onglet de destination précédents avant de relancer.
请切换回上次转交使用的队伍后再重跑。|Switch back to the previous team before retrying.|Volte à equipe da transferência anterior antes de tentar novamente.|Rudi kwenye timu ya awali kabla ya kujaribu tena.|Rétablissez l’équipe du transfert précédent avant de relancer.
请恢复上次转交使用的地区配置分表后再重跑。|Restore the previous region settings tab before retrying.|Restaure a aba de configuração regional anterior antes de tentar novamente.|Rejesha kichupo cha awali cha mipangilio ya maeneo kabla ya kujaribu tena.|Rétablissez l’onglet précédent des paramètres régionaux avant de relancer.
正在读取当前队伍的专用地区配置…|Loading this team’s region settings…|Carregando a configuração regional desta equipe…|Inapakia mipangilio ya maeneo ya timu hii…|Chargement des paramètres régionaux de cette équipe…
正在同步地区配置分表“{0}”…|Syncing region settings from “{0}”…|Sincronizando a configuração regional de “{0}”…|Inasawazisha mipangilio ya maeneo kutoka “{0}”…|Synchronisation des paramètres régionaux depuis « {0} »…
开始重跑 {0} 个失败行：第 {1} 行，逐行调用 {2}（{3}）…|Retrying {0} failed rows ({1}) with {2} ({3}), one row at a time…|Reprocessando {0} linhas com falha ({1}) com {2} ({3}), uma linha por vez…|Inajaribu tena safu mlalo {0} zilizoshindwa ({1}) kwa {2} ({3}), moja baada ya nyingine…|Relance de {0} lignes en échec ({1}) avec {2} ({3}), une ligne à la fois…
重跑完成：成功 {0} 行，回写 {1} 个字段。|Retry finished: {0} rows succeeded and {1} fields were updated.|Reprocessamento concluído: {0} linhas com sucesso e {1} campos atualizados.|Jaribio jipya limekamilika: safu mlalo {0} zimefanikiwa na sehemu {1} zimesasishwa.|Relance terminée : {0} lignes traitées et {1} champs mis à jour.
重跑完成：成功 {0} 行，回写 {1} 个字段；仍失败 {2} 行（第 {3} 行）。|Retry finished: {0} rows succeeded, {1} fields updated, and {2} rows still failed ({3}).|Reprocessamento concluído: {0} linhas com sucesso, {1} campos atualizados e {2} linhas ainda com falha ({3}).|Jaribio jipya limekamilika: safu mlalo {0} zimefanikiwa, sehemu {1} zimesasishwa, na safu mlalo {2} bado zimeshindwa ({3}).|Relance terminée : {0} lignes traitées, {1} champs mis à jour et {2} lignes toujours en échec ({3}).
未知时间|unknown time|horário desconhecido|muda haujulikani|heure inconnue
第 {0} 行：{1}。|Row {0}: {1:t}.|Linha {0}: {1:t}.|Safu mlalo {0}: {1:t}.|Ligne {0} : {1:t}.
地区配置 A 列未匹配到国家|No country match in region column A|Nenhum país correspondente na coluna A regional|Hakuna nchi inayolingana katika safu wima A ya maeneo|Aucun pays correspondant en colonne régionale A
该国家的地区配置 B 列未匹配到省区|No province match in region column B for this country|Nenhuma província correspondente na coluna B regional para este país|Hakuna mkoa unaolingana katika safu wima B ya maeneo ya nchi hii|Aucune province correspondante en colonne régionale B pour ce pays
该国家和省区的地区配置 C 列没有市区条目|No cities are configured in column C for this country and province|Não há cidades configuradas na coluna C para este país e província|Hakuna miji iliyowekwa katika safu wima C kwa nchi na mkoa huu|Aucune ville configurée en colonne C pour ce pays et cette province
地区配置 C 列有条目，但未匹配到市区|No city match among region column C entries|Nenhuma cidade correspondente entre as entradas da coluna C regional|Hakuna mji unaolingana kati ya maingizo ya safu wima C ya maeneo|Aucune ville correspondante parmi les entrées de la colonne régionale C
转交 {0} 行 · V 列补全 {1} 格 · AL 拆解成功 {2}/{3}（失败：第 {4} 行）|Transferred {0} rows · Filled {1} cells in V · AL analysis succeeded for {2}/{3} (failed rows: {4})|{0} linhas transferidas · {1} células preenchidas em V · {2}/{3} análises bem-sucedidas em AL (falhas: linhas {4})|Safu mlalo {0} zimehamishwa · Visanduku {1} vimejazwa katika V · Uchanganuzi wa AL umefanikiwa kwa {2}/{3} (safu mlalo zilizoshindwa: {4})|{0} lignes transférées · {1} cellules complétées en V · {2}/{3} analyses réussies en AL (lignes en échec : {4})
地址识别 {0} 行：国家 {1}/{2} · 省 {3}/{4}（其中地理推断 {5}·近邻推断 {6}）· 市/区 {7}/{8}；{9}|Address matching for {0} rows: country {1}/{2} · province {3}/{4} (geographic inference: {5}, nearby inference: {6}) · city/district {7}/{8}{9:t}|Correspondência de endereços em {0} linhas: país {1}/{2} · província {3}/{4} (inferência geográfica: {5}, por proximidade: {6}) · cidade/distrito {7}/{8}{9:t}|Ulinganishaji wa anwani katika safu mlalo {0}: nchi {1}/{2} · mkoa {3}/{4} (makadirio ya kijiografia: {5}, ya ukaribu: {6}) · mji/wilaya {7}/{8}{9:t}|Correspondance des adresses sur {0} lignes : pays {1}/{2} · province {3}/{4} (déduction géographique : {5}, de proximité : {6}) · ville/district {7}/{8}{9:t}
地址识别 {0} 行：国家 {1}/{2} · 省 {3}/{4}（其中地理推断 {5}·近邻推断 {6}）· 市/区 {7}/{8}|Address matching for {0} rows: country {1}/{2} · province {3}/{4} (geographic inference: {5}, nearby inference: {6}) · city/district {7}/{8}|Correspondência de endereços em {0} linhas: país {1}/{2} · província {3}/{4} (inferência geográfica: {5}, por proximidade: {6}) · cidade/distrito {7}/{8}|Ulinganishaji wa anwani katika safu mlalo {0}: nchi {1}/{2} · mkoa {3}/{4} (makadirio ya kijiografia: {5}, ya ukaribu: {6}) · mji/wilaya {7}/{8}|Correspondance des adresses sur {0} lignes : pays {1}/{2} · province {3}/{4} (déduction géographique : {5}, de proximité : {6}) · ville/district {7}/{8}
国家未命中: {0}；市/区未命中: {1}|. Country misses: {0}. City/district misses: {1}|. País sem correspondência: {0}. Cidade/distrito sem correspondência: {1}|. Nchi zisizolingana: {0}. Miji/wilaya zisizolingana: {1}|. Pays sans correspondance : {0}. Villes ou districts sans correspondance : {1}
国家未命中: {0}|. Country misses: {0}|. País sem correspondência: {0}|. Nchi zisizolingana: {0}|. Pays sans correspondance : {0}
市/区未命中: {0}|. City/district misses: {0}|. Cidade/distrito sem correspondência: {0}|. Miji/wilaya zisizolingana: {0}|. Villes ou districts sans correspondance : {0}
已解析但目标表下拉缺少对应选项（未写入）：{0}|Parsed values were skipped because the destination dropdowns lack matching options: {0}|Os valores foram ignorados porque faltam opções correspondentes nas listas de destino: {0}|Thamani zilizochanganuliwa zimerukwa kwa sababu orodha lengwa hazina chaguo zinazolingana: {0}|Les valeurs analysées ont été ignorées faute d’options correspondantes dans les listes de destination : {0}
请从扩展图标打开控制台|Open the console from the extension icon|Abra o console pelo ícone da extensão|Fungua dashibodi kupitia ikoni ya kiendelezi|Ouvrez la console depuis l’icône de l’extension
不要直接双击 dashboard.html。请先到 chrome://extensions 重新加载“表格转交”，再点击浏览器右上角的扩展图标打开。|Reload the extension at chrome://extensions, then click its toolbar icon to open the console.|Recarregue a extensão em chrome://extensions e clique no ícone na barra do navegador para abrir o console.|Pakia kiendelezi upya katika chrome://extensions, kisha bofya ikoni yake kwenye upau wa kivinjari kufungua dashibodi.|Rechargez l’extension dans chrome://extensions, puis cliquez sur son icône dans la barre du navigateur pour ouvrir la console.
扩展 API 不可用：请从扩展图标打开 dashboard.html。|Extension API unavailable. Open the console from the extension icon.|API da extensão indisponível. Abra o console pelo ícone da extensão.|API ya kiendelezi haipatikani. Fungua dashibodi kupitia ikoni ya kiendelezi.|API de l’extension indisponible. Ouvrez la console depuis l’icône de l’extension.
表格自动化|SPREADSHEET AUTOMATION|AUTOMAÇÃO DE PLANILHAS|UENDESHAJI WA LAHAJEDWALI|AUTOMATISATION DES FEUILLES
`.trim().split('\n').map(line => {
    const [source, ...translations] = line.split('|');
    return [source, translations];
  }));

  let language = 'zh';
  const escapePattern = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const literalLength = source => source.replace(/\{\d+\}/g, '').length;
  const templates = [...messages].filter(([source]) => source.includes('{0}'))
    .sort(([left], [right]) => literalLength(right) - literalLength(left))
    .map(([source, variants]) => {
      const pattern = source.split(/\{\d+\}/).map(escapePattern).join('([\\s\\S]*?)');
      return [new RegExp('^' + pattern + '$'), variants];
    });
  const translate = (source, depth) => {
    const index = columns.indexOf(language);
    if (index < 0 || typeof source !== 'string' || depth > 6) return source;
    if (messages.has(source)) return messages.get(source)[index];
    for (const [pattern, variants] of templates) {
      const match = source.match(pattern);
      if (match) {
        return variants[index].replace(/\{(\d+)(:t)?\}/g, (_, number, localize) => {
          const value = match[Number(number) + 1];
          return localize ? translate(value, depth + 1) : value;
        });
      }
    }
    return source;
  };
  const t = source => translate(source, 0);
  const rendered = new WeakMap();
  const render = (node, formatter) => {
    rendered.set(node, formatter);
    node.textContent = formatter();
  };
  const refreshRendered = root => {
    for (const node of root.querySelectorAll('[data-localized-output]')) {
      const formatter = rendered.get(node);
      if (formatter) node.textContent = formatter();
    }
  };
  const setLanguage = value => { language = Object.hasOwn(languages, value) ? value : 'zh'; };

  globalThis.interfaceLocale = {
    t, setLanguage, render,
    async setup(onChange) {
      const root = document.documentElement;
      const translations = new Map();
      for (const [source, variants] of messages) {
        for (const variant of variants) {
          if (!translations.has(variant)) translations.set(variant, source);
        }
      }
      const targets = [];
      const bind = (read, write) => {
        const initial = read();
        const source = initial.trim();
        if (messages.has(source)) targets.push(() => write(initial.replace(source, t(source))));
      };
      const dynamic = '#authorize, #connectionText, #start, #heroText, #diagnoseTarget, #retryFailedRows, #regionCacheStatus, #saveStatus, #status, .secret-toggle, #aDateValue';
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement.closest(dynamic + ', script, style, textarea')) {
          bind(() => node.data, value => { node.data = value; });
        }
      }
      for (const element of root.querySelectorAll('[placeholder], [aria-label], [title]')) {
        if (element.closest(dynamic)) continue;
        for (const name of ['placeholder', 'aria-label', 'title']) {
          if (element.hasAttribute(name)) bind(() => element.getAttribute(name), value => element.setAttribute(name, value));
        }
      }
      const previous = new WeakMap();
      const refresh = () => {
        for (const element of document.querySelectorAll(dynamic)) {
          const node = element.id === 'aDateValue' ? element.querySelector('option[value=""]') : element;
          if (!node) continue;
          if (!previous.has(node)) previous.set(node, {});
          const entries = previous.get(node);
          for (const name of ['textContent', 'title', 'aria-label']) {
            const value = name === 'textContent' ? node.textContent : node.getAttribute(name);
            if (!value) continue;
            const source = entries[name]?.translated === value ? entries[name].source : (translations.get(value) ?? value);
            const translated = t(source);
            entries[name] = { source, translated };
            if (translated === value) continue;
            if (name === 'textContent') node.textContent = translated;
            else node.setAttribute(name, translated);
          }
        }
      };
      const observer = new MutationObserver(refresh);
      for (const element of document.querySelectorAll(dynamic)) {
        observer.observe(element, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label', 'title'] });
      }
      const update = value => {
        setLanguage(value);
        root.lang = language === 'zh' ? 'zh-CN' : language;
        select.value = language;
        targets.forEach(render => render());
        refresh();
        refreshRendered(root);
        onChange?.();
      };
      const select = document.querySelector('#interfaceLanguage');
      select.replaceChildren(...Object.entries(languages).map(([code, name]) => new Option(name, code)));
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.interfaceLanguage) update(changes.interfaceLanguage.newValue);
      });
      const settings = await chrome.storage.local.get({ interfaceLanguage: 'zh' }).catch(error => {
        console.error(error);
        return { interfaceLanguage: 'zh' };
      });
      update(settings.interfaceLanguage);
      select.addEventListener('change', async () => {
        try {
          const selected = select.value;
          await chrome.storage.local.set({ interfaceLanguage: selected });
          update(selected);
        } catch (error) {
          select.value = language;
          console.error(error);
        }
      });
    }
  };
})();
