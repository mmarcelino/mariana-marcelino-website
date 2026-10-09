"""Builds the blog: /blog/index.html, one folder per article, plus
/sitemap.xml, /robots.txt and /llms.txt. Edit posts.py-style data below and
run:  python3 blog/_build.py
"""
import html, json, os, re, time, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.mariana-marcelino.com"
CALENDLY = "https://calendly.com/marianacmarcelino/30min"
LINKEDIN = "https://www.linkedin.com/in/marianamarcelino-frontend-engineer/"
VERSION = str(int(time.time()))
MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
          "agosto", "setembro", "outubro", "novembro", "dezembro"]

# --------------------------------------------------------------------------
# Posts (newest first)
# --------------------------------------------------------------------------
POSTS = [
{
"slug": "como-aparecer-no-chatgpt",
"title": "Como fazer o seu negócio aparecer nas respostas do ChatGPT",
"description": "Cada vez mais clientes pedem recomendações a ferramentas de IA. Saiba o que leva o ChatGPT, o Perplexity e o Google a citar um negócio e como preparar o seu site.",
"dek": "Cada vez mais pessoas pedem recomendações a uma ferramenta de IA em vez de percorrerem uma página de resultados. Eis o que faz um negócio ser citado nessas respostas e como preparar o seu site.",
"category": "IA e pesquisa",
"topics": ["IA e pesquisa", "SEO"],
"date": "2026-08-25",
"cover": "ia-chatgpt",
"cover_alt": "Ilustração: uma resposta luminosa ao centro, com órbitas e três fontes citadas em destaque",
"takeaways": [
  "As ferramentas de IA recomendam negócios que conseguem ler, perceber e confirmar noutras fontes.",
  "O seu site tem de estar acessível aos robôs de pesquisa e dizer claramente o que faz, para quem e onde.",
  "Respostas diretas a perguntas reais, como numa secção de perguntas frequentes, são o formato mais fácil de citar.",
  "Avaliações, menções noutros sites e um Perfil da Empresa no Google completo reforçam a confiança.",
],
"body": """
<h2>A pesquisa mudou de forma</h2>
<p>Durante anos, aparecer online significava subir posições no Google. Hoje, muitos clientes fazem a pergunta completa a uma ferramenta de IA, algo como <em>“que estúdio de interiores em Braga trabalha bem apartamentos pequenos?”</em>, e recebem uma resposta curta com meia dúzia de nomes.</p>
<p>Se o seu negócio não está entre esses nomes, para aquele cliente simplesmente não existe. O SEO tradicional continua a contar, até porque estas ferramentas se apoiam em índices de pesquisa, mas o objetivo muda: já não basta ficar bem posicionado, é preciso ser <strong>citado</strong>.</p>

<h2>Como é que a IA escolhe quem recomendar</h2>
<p>Não existe uma fórmula pública, mas há um padrão claro. As ferramentas tendem a recomendar negócios que cumprem três condições:</p>
<ol>
  <li><strong>Conseguem aceder ao conteúdo</strong>: o site não bloqueia os robôs que recolhem informação.</li>
  <li><strong>Percebem o que o negócio faz</strong>: a informação é explícita, estruturada e sem ambiguidades.</li>
  <li><strong>Encontram confirmação noutros sítios</strong>: avaliações, diretórios, imprensa e dados consistentes.</li>
</ol>
<p>Os cinco passos seguintes trabalham exatamente estas três condições.</p>

<h2>1. Garanta que os robôs conseguem ler o seu site</h2>
<p>Parece óbvio, mas é o erro mais comum. Há sites que bloqueiam, sem o saber, os robôs de pesquisa através do ficheiro <code>robots.txt</code>, de um plugin de segurança ou de uma definição do alojamento.</p>
<ul>
  <li>Confirme que o <code>robots.txt</code> não bloqueia o Googlebot, o Bingbot nem os robôs das ferramentas de IA, como o OAI-SearchBot (pesquisa do ChatGPT) e o PerplexityBot.</li>
  <li>Registe o site no Google Search Console e no Bing Webmaster Tools e envie o seu sitemap. Várias ferramentas de IA apoiam-se em índices de pesquisa existentes, e o do Bing é um deles.</li>
  <li>Garanta que o texto importante está em texto, e não apenas dentro de imagens, vídeos ou PDFs.</li>
</ul>

<h2>2. Diga claramente o que faz, para quem e onde</h2>
<p>Slogans bonitos mas vagos são difíceis de interpretar, tanto para pessoas como para máquinas. A primeira frase da sua homepage deve responder a três perguntas: o que faz, para quem e onde.</p>
<div class="compare">
  <p class="-bad"><b>Vago</b>Soluções à medida para transformar o seu espaço.</p>
  <p class="-good"><b>Claro</b>Estúdio de arquitetura de interiores em Braga, especializado na remodelação de apartamentos e pequenos espaços comerciais.</p>
</div>
<p>Dê também a cada serviço a sua própria página, com um título que o nomeie tal como os clientes o procuram.</p>

<h2>3. Responda às perguntas que os seus clientes fazem</h2>
<p>As ferramentas de IA existem para responder a perguntas. Quanto mais o seu site responder diretamente às perguntas reais dos seus clientes, mais fácil é ser usado como fonte.</p>
<ul>
  <li>Quanto custa, em média, o seu serviço?</li>
  <li>Quanto tempo demora?</li>
  <li>Em que zonas trabalha?</li>
  <li>Como funciona o processo, do primeiro contacto ao fim?</li>
</ul>
<p>Escreva a resposta logo na primeira frase e desenvolva a seguir. Uma secção de perguntas frequentes em cada página de serviço é uma excelente forma de o fazer.</p>
<div class="callout"><b>Dica</b>Para descobrir as perguntas certas, releia os emails e as mensagens de WhatsApp dos últimos meses. As perguntas que se repetem são as que deve responder no site.</div>

<h2>4. Use dados estruturados</h2>
<p>Os dados estruturados (<em>schema.org</em>) são pequenos blocos de código invisíveis para os visitantes, que descrevem o seu negócio de forma inequívoca: nome, morada, horário, serviços, zona de atuação e avaliações.</p>
<p>Os mais úteis para um pequeno negócio são <code>LocalBusiness</code> (ou o tipo mais específico do seu setor), <code>Service</code> e <code>FAQPage</code>. Não mudam o aspeto do site, mas eliminam dúvidas sobre quem é e o que faz.</p>

<h2>5. Construa confiança fora do seu site</h2>
<p>Uma ferramenta de IA não recomenda um negócio só porque o próprio site diz que é o melhor. Procura confirmação noutros sítios:</p>
<ul>
  <li>Um Perfil da Empresa no Google completo, com fotografias reais e informação atualizada.</li>
  <li>Avaliações recentes e detalhadas, que mencionem o serviço e a localidade.</li>
  <li>Nome, morada e telefone iguais em todos os diretórios e redes sociais.</li>
  <li>Menções em imprensa local, associações do setor e sites de parceiros.</li>
</ul>

<h2>E o ficheiro llms.txt?</h2>
<p>O <code>llms.txt</code> é uma proposta recente: um ficheiro de texto simples, na raiz do site, que resume o negócio e aponta para as páginas mais importantes, a pensar nos modelos de linguagem. Ainda não é um padrão, nem garante nada, mas é rápido de criar. Vale a pena tê-lo, desde que os cinco pontos anteriores estejam resolvidos primeiro.</p>

<h2>Por onde começar</h2>
<ol>
  <li>Pergunte ao ChatGPT e ao Perplexity o que os seus clientes perguntariam e registe quem aparece.</li>
  <li>Verifique o <code>robots.txt</code> e registe o site no Search Console e no Bing Webmaster Tools.</li>
  <li>Reescreva a primeira frase da homepage para dizer o que faz, para quem e onde.</li>
  <li>Acrescente perguntas frequentes às páginas de serviço.</li>
  <li>Complete o Perfil da Empresa no Google e peça avaliações aos últimos clientes.</li>
</ol>
""",
"faq": [
  ("É preciso pagar para aparecer nas respostas do ChatGPT?",
   "Não. As recomendações orgânicas não se compram: dependem da informação que as ferramentas encontram e conseguem confirmar sobre o seu negócio."),
  ("SEO e otimização para IA são coisas diferentes?",
   "Partilham a mesma base: um site acessível, rápido e com conteúdo claro. A otimização para IA dá mais peso a respostas diretas, a dados estruturados e à confirmação da sua reputação noutras fontes."),
  ("Quanto tempo demora a ver resultados?",
   "As correções técnicas, como desbloquear robôs ou enviar o sitemap, produzem efeito em semanas. A reputação fora do site, com avaliações e menções, constrói-se ao longo de meses."),
  ("Como sei se o meu negócio já aparece?",
   "Faça às ferramentas as perguntas que os seus clientes fariam, com várias formulações, e registe os resultados. Nas estatísticas do site, veja também se recebe visitas vindas de chatgpt.com ou perplexity.ai."),
],
},
{
"slug": "sinais-que-o-site-esta-a-afastar-clientes",
"title": "8 sinais de que o seu site está a afastar clientes",
"description": "Um site desatualizado custa-lhe contactos todos os dias, mesmo sem dar por isso. Os oito sinais mais comuns e o que fazer com cada um deles.",
"dek": "Um site raramente avaria de forma visível. Vai simplesmente deixando de funcionar e os contactos diminuem sem que se perceba porquê. Estes são os oito sinais a que deve estar atento.",
"category": "Redesign",
"topics": ["Redesign", "Conversão", "SEO"],
"date": "2026-07-28",
"cover": "sinais-site",
"cover_alt": "Ilustração: oito páginas de um site que se afastam e desvanecem da esquerda para a direita",
"takeaways": [
  "Os visitantes decidem em poucos segundos se ficam ou se saem.",
  "Problemas em mobile, lentidão e mensagens vagas são os que mais afastam clientes.",
  "Nem todos os sinais pedem um site novo: alguns resolvem-se com ajustes pontuais.",
  "Se identificar quatro ou mais sinais, um redesign é normalmente o caminho mais eficaz.",
],
"body": """
<h2>1. No telemóvel, é difícil de usar</h2>
<p>Para a maioria dos negócios, grande parte das visitas chega por telemóvel. Se é preciso fazer zoom para ler, se os botões são pequenos demais ou se o menu não funciona bem, o visitante desiste.</p>
<p><strong>O que fazer:</strong> abra o seu site no telemóvel e tente fazer o que um cliente faria: perceber o que oferece e entrar em contacto. Se não conseguir em menos de um minuto, há trabalho a fazer.</p>

<h2>2. Demora a carregar</h2>
<p>Cada segundo de espera aumenta a probabilidade de o visitante voltar para trás. Imagens pesadas, demasiados plugins e alojamento lento são as causas mais frequentes.</p>
<p><strong>O que fazer:</strong> teste o site no PageSpeed Insights, da Google. Comprimir imagens e retirar o que não é usado costuma trazer melhorias imediatas.</p>

<h2>3. Não se percebe o que faz em cinco segundos</h2>
<p>Se a primeira coisa que o visitante vê é um slogan genérico ou uma imagem sem contexto, obriga-o a procurar. A maioria não procura: sai.</p>
<p><strong>O que fazer:</strong> garanta que o topo da homepage diz, numa frase, o que faz, para quem e qual é o próximo passo.</p>

<h2>4. Não há um próximo passo claro</h2>
<p>Um visitante interessado precisa de saber o que fazer a seguir: pedir um orçamento, marcar uma chamada, reservar. Quando há cinco opções ao mesmo nível, ou nenhuma, a decisão fica adiada.</p>
<p><strong>O que fazer:</strong> escolha uma ação principal por página e torne-a evidente, com um botão visível sem ser preciso fazer scroll.</p>

<h2>5. O design parece de outra época</h2>
<p>Um rodapé com “© 2019”, fotografias genéricas de bancos de imagem ou um estilo claramente datado transmitem que o negócio parou no tempo, mesmo que não seja verdade.</p>
<p><strong>O que fazer:</strong> use fotografias reais da sua equipa, do seu espaço e do seu trabalho, e atualize datas, conteúdos e referências antigas.</p>

<h2>6. Contactar dá trabalho</h2>
<p>Formulários com dez campos, um email escondido no rodapé ou a obrigação de ligar em horário de expediente são obstáculos desnecessários.</p>
<p><strong>O que fazer:</strong> reduza o formulário ao essencial e ofereça alternativas, como WhatsApp, marcação online ou chat, para quem prefere outro canal.</p>

<h2>7. Não encontram o seu negócio no Google nem nas ferramentas de IA</h2>
<p>Um site bonito que ninguém encontra não gera contactos. Pesquise pelo seu serviço e pela sua localidade: se o seu negócio não aparece, os seus concorrentes estão a ficar com esses clientes.</p>
<p><strong>O que fazer:</strong> reveja títulos, descrições e conteúdos de cada página e complete o seu Perfil da Empresa no Google. Neste artigo explicamos <a href="../como-aparecer-no-chatgpt/">como aparecer também nas respostas do ChatGPT</a>.</p>

<h2>8. Não consegue atualizá-lo sem ajuda</h2>
<p>Se mudar um preço ou acrescentar um projeto implica pedir ajuda e esperar dias, o site acaba por ficar desatualizado. E um site desatualizado transmite desleixo.</p>
<p><strong>O que fazer:</strong> garanta que tem acesso e autonomia para editar os conteúdos do dia a dia.</p>

<h2>Redesign ou ajustes?</h2>
<p>Se identificou um ou dois sinais, provavelmente bastam ajustes pontuais. Se identificou quatro ou mais, ou se a estrutura do site já não reflete o que o seu negócio faz hoje, um redesign tende a ser mais eficaz e mais económico do que remendos sucessivos.</p>
<p>Não tem a certeza de quantos sinais tem o seu site? <a href="../../diagnostico/">Faça o diagnóstico gratuito</a>: em 2 minutos fica a saber onde o site está a perder e qual o próximo passo que faz mais sentido.</p>
<p>Se quiser uma opinião concreta, posso <a href="../../#free">redesenhar a homepage do seu site gratuitamente</a> para que veja o potencial antes de decidir.</p>
""",
"faq": [
  ("De quanto em quanto tempo devo renovar o meu site?",
   "Não há uma regra fixa. Reveja o site uma vez por ano e considere um redesign quando o seu negócio mudou, ou quando identifica vários dos sinais deste artigo."),
  ("Um redesign pode fazer-me perder posições no Google?",
   "Pode, se os endereços das páginas mudarem sem redirecionamentos ou se se perder conteúdo. Com redirecionamentos 301 bem planeados e o conteúdo importante preservado, o risco é mínimo."),
  ("Posso manter os conteúdos atuais num redesign?",
   "Sim. Um redesign visual pode manter a estrutura e os textos existentes e melhorar apenas o design, a legibilidade e a experiência em mobile."),
],
},
{
"slug": "seo-local-para-pequenos-negocios",
"title": "SEO local: como ser encontrado por clientes na sua zona",
"description": "Guia prático para pequenos negócios aparecerem no Google Maps e nas pesquisas locais: Perfil da Empresa, avaliações, páginas por localidade e dados estruturados.",
"dek": "Quem pesquisa “perto de mim” ou junta uma cidade à pesquisa costuma estar pronto para contratar. Este guia mostra como fazer com que o seu negócio seja a resposta.",
"category": "SEO",
"topics": ["SEO", "IA e pesquisa"],
"date": "2026-06-23",
"cover": "seo-local",
"cover_alt": "Ilustração: mapa topográfico com um local assinalado a verde-água",
"takeaways": [
  "As pesquisas com intenção local vêm, muitas vezes, de pessoas prontas a contratar.",
  "O Perfil da Empresa no Google é o ponto de partida, e é gratuito.",
  "Nome, morada e telefone têm de ser iguais em todo o lado.",
  "Avaliações recentes e detalhadas fazem diferença na escolha do cliente.",
],
"body": """
<h2>O que é o SEO local</h2>
<p>O SEO local é o conjunto de práticas que ajudam um negócio a aparecer quando alguém procura um serviço numa zona específica, seja no mapa do Google, nos resultados de pesquisa ou nas respostas das ferramentas de IA.</p>
<p>Para negócios que servem clientes numa região, como clínicas, estúdios, restaurantes, construtoras ou consultórios, é muitas vezes a forma mais rentável de conseguir novos contactos.</p>

<h2>1. Crie e complete o Perfil da Empresa no Google</h2>
<p>O Perfil da Empresa no Google (antigo Google My Business) é o que aparece no mapa e no painel lateral dos resultados. É gratuito e é, provavelmente, a ação com maior impacto neste guia.</p>
<ul>
  <li>Escolha a categoria principal com cuidado: deve descrever o que faz, não o que gostaria de fazer.</li>
  <li>Acrescente categorias secundárias, serviços, horário e zona de atuação.</li>
  <li>Publique fotografias reais do espaço, da equipa e do trabalho, e atualize-as regularmente.</li>
  <li>Garanta que o link para o site aponta para a página certa.</li>
</ul>

<h2>2. Mantenha nome, morada e telefone consistentes</h2>
<p>O Google e as ferramentas de IA cruzam informação de várias fontes. Se o nome, a morada ou o telefone aparecem de formas diferentes no site, no perfil, nas redes sociais e nos diretórios, a confiança nesses dados diminui.</p>
<p>Escolha uma versão exata e use-a em todo o lado, até na forma de escrever a rua.</p>

<h2>3. Peça avaliações e responda a todas</h2>
<p>As avaliações influenciam o posicionamento e, sobretudo, a decisão do cliente. As mais valiosas são recentes, detalhadas e mencionam o serviço e a localidade.</p>
<ul>
  <li>Peça a avaliação logo após um trabalho bem-sucedido, enquanto a experiência está fresca.</li>
  <li>Envie um link direto, para que deixar a avaliação demore segundos.</li>
  <li>Responda a todas, incluindo às negativas, com calma e profissionalismo.</li>
</ul>
<div class="callout"><b>Dica</b>Sugira ao cliente que conte que serviço contratou e onde. Uma avaliação como “remodelaram a nossa cozinha em Matosinhos em três semanas” vale muito mais do que “excelente serviço”.</div>

<h2>4. Dê a cada serviço e localidade a sua página</h2>
<p>Se trabalha em várias cidades ou oferece vários serviços, crie páginas dedicadas. Mas evite o erro comum de duplicar a mesma página e trocar apenas o nome da cidade: isso é visto como conteúdo de baixa qualidade.</p>
<p>Cada página deve ter conteúdo genuíno, como projetos realizados naquela zona, particularidades locais e testemunhos de clientes dali.</p>

<h2>5. Mostre ao Google onde está</h2>
<ul>
  <li>Inclua a morada e o contacto no rodapé de todas as páginas.</li>
  <li>Tenha uma página de contacto com mapa e indicações.</li>
  <li>Acrescente dados estruturados <code>LocalBusiness</code> com nome, morada, horário, zona de atuação e contactos.</li>
</ul>

<h2>6. Um site rápido e pensado para o telemóvel</h2>
<p>Muitas pesquisas locais acontecem no telemóvel, muitas vezes na rua ou a caminho. O site tem de abrir depressa e permitir ligar, pedir indicações ou enviar mensagem com um toque.</p>

<h2>Como medir resultados</h2>
<p>No Perfil da Empresa pode acompanhar chamadas, pedidos de indicações e cliques para o site. No Google Search Console, veja que pesquisas com nomes de localidades trazem visitas. São estes números, e não apenas a posição no mapa, que mostram se o SEO local está a gerar negócio.</p>
""",
"faq": [
  ("Preciso de ter uma morada física para aparecer no Google Maps?",
   "Não. Se atende os clientes nas instalações deles, pode ocultar a morada no Perfil da Empresa e definir, em alternativa, a zona onde presta serviço."),
  ("Posso criar perfis para várias localidades?",
   "Apenas se tiver instalações reais nessas localidades, com atendimento. Criar perfis em moradas onde não está presente viola as regras do Google e pode levar à suspensão."),
  ("Quanto tempo demora a aparecer no mapa?",
   "A verificação do perfil costuma levar alguns dias. A melhoria de posições é gradual e depende da concorrência na sua zona, da relevância do perfil e das avaliações."),
],
},
{
"slug": "site-com-visitas-mas-sem-contactos",
"title": "Tem visitas mas não recebe contactos? 7 correções para o seu site",
"description": "Se as pessoas visitam o seu site mas não entram em contacto, o problema raramente é o tráfego. Sete mudanças práticas para transformar visitas em pedidos.",
"dek": "Trazer visitas é a parte cara. Perdê-las por falta de clareza ou de confiança é a parte evitável. Sete correções que transformam visitas em pedidos de contacto.",
"category": "Conversão",
"topics": ["Conversão"],
"date": "2026-05-26",
"cover": "visitas-contactos",
"cover_alt": "Ilustração: muitos pontos a convergir para uma passagem estreita, por onde só alguns atravessam",
"takeaways": [
  "O problema raramente é falta de visitas: é falta de clareza e de confiança.",
  "Cada página deve ter um objetivo e um próximo passo evidente.",
  "Menos campos, mais canais de contacto e provas reais aumentam os pedidos.",
  "Sem medição, está a tomar decisões às cegas.",
],
"body": """
<h2>1. Um título que diz o que faz, e para quem</h2>
<p>O visitante tem de perceber, em segundos, se está no sítio certo. O título principal deve nomear o serviço e o tipo de cliente, e não apenas uma promessa genérica.</p>
<div class="compare">
  <p class="-bad"><b>Antes</b>Qualidade e confiança desde 2005.</p>
  <p class="-good"><b>Depois</b>Contabilidade para restaurantes e cafés no Porto, com acompanhamento mensal e resposta em 24 horas.</p>
</div>

<h2>2. Um único próximo passo por página</h2>
<p>Quando tudo é importante, nada é. Escolha a ação principal de cada página, seja pedir um orçamento, marcar uma chamada ou reservar, e dê-lhe destaque: um botão visível logo no topo e repetido ao longo da página.</p>
<p>As ações secundárias podem existir, mas com menos peso visual.</p>

<h2>3. Formulários curtos</h2>
<p>Cada campo a mais é uma razão a mais para desistir. Peça apenas o que precisa para responder: normalmente, nome, email e uma mensagem. O resto pode perguntar depois.</p>

<h2>4. Mais do que uma forma de contactar</h2>
<p>Há quem prefira escrever, quem prefira falar e quem queira marcar diretamente. Oferecer alternativas aumenta a probabilidade de o visitante dar o passo:</p>
<ul>
  <li>WhatsApp, para uma pergunta rápida.</li>
  <li>Marcação online, para quem já está decidido.</li>
  <li>Um chat que responde às perguntas mais comuns e passa a conversa a uma pessoa quando é preciso.</li>
</ul>

<h2>5. Mostre provas reais</h2>
<p>Antes de contactar, o visitante quer saber se pode confiar em si. Testemunhos com nome e contexto, logótipos de clientes, fotografias de projetos reais e números concretos do seu trabalho valem mais do que qualquer adjetivo.</p>
<div class="callout"><b>Dica</b>Coloque um testemunho perto do botão de contacto. É nesse momento que a dúvida “será que vale a pena?” pesa mais.</div>

<h2>6. Responda às objeções antes de aparecerem</h2>
<p>Preço, prazos, zona de atuação, como funciona o processo: se estas dúvidas ficam por responder, muitos visitantes preferem não perguntar e vão ver a concorrência.</p>
<p>Um intervalo de preços (“a partir de…”), uma explicação simples do processo e uma secção de perguntas frequentes eliminam grande parte da hesitação.</p>

<h2>7. Meça o que acontece</h2>
<p>Sem dados, as melhorias são palpites. Configure uma ferramenta de estatísticas, como o Google Analytics ou uma alternativa focada na privacidade, e registe as ações importantes: cliques em botões de contacto, envios de formulário, cliques no WhatsApp e marcações.</p>
<p>Depois, veja onde as pessoas saem e comece por aí.</p>

<h2>Por onde começar</h2>
<p>Não precisa de mudar tudo de uma vez. Identifique as três páginas com mais visitas e aplique-lhes estas sete correções. É aí que qualquer melhoria tem mais impacto.</p>
""",
"faq": [
  ("Qual é uma boa taxa de conversão para um site?",
   "Varia muito com o setor, o tipo de serviço e a origem das visitas, por isso as médias gerais são pouco úteis. Mais importante do que comparar com outros é medir a sua taxa e fazê-la subir ao longo do tempo."),
  ("Devo mostrar preços no site?",
   "Na maioria dos casos, sim, pelo menos um intervalo ou um valor de partida. Filtra contactos sem orçamento, reduz a hesitação de quem está interessado e transmite transparência."),
  ("Um chatbot vale a pena num site pequeno?",
   "Vale se responder bem às perguntas mais frequentes e passar a conversa a uma pessoa quando é preciso. Não deve substituir o contacto humano, mas pode captar pedidos fora do horário de expediente."),
],
},
{
"slug": "quanto-custa-um-site-profissional",
"title": "Quanto custa um site profissional? O que influencia o preço",
"description": "De construtores de sites a agências: o que determina o preço de um site profissional, o que deve estar incluído e como comparar propostas sem surpresas.",
"dek": "Duas propostas para “o mesmo site” podem ter valores muito diferentes. Este guia explica o que faz variar o preço, o que deve estar incluído e como comparar de forma justa.",
"category": "Investimento",
"topics": ["Investimento", "Redesign"],
"date": "2026-04-28",
"cover": "custo-site",
"cover_alt": "Ilustração: gráfico de barras crescente, com as últimas barras em lilás",
"takeaways": [
  "O preço depende sobretudo do âmbito: páginas, conteúdos, funcionalidades e integrações.",
  "Compare o que está incluído em cada proposta, e não apenas o valor final.",
  "Os custos recorrentes, como domínio, alojamento e manutenção, também contam.",
  "Um site deve ser avaliado pelo que gera, e não apenas pelo que custa.",
],
"body": """
<h2>As três formas mais comuns de ter um site</h2>
<h3>Construtores de sites</h3>
<p>Plataformas como o Wix ou o Squarespace permitem criar um site sozinho a partir de modelos. O custo direto é baixo, mas o investimento real é o seu tempo, e o resultado depende muito da sua experiência em design, escrita e SEO.</p>
<h3>Profissional independente</h3>
<p>Um profissional trata do design e do desenvolvimento, com contacto direto e sem as camadas de uma estrutura maior. É muitas vezes o melhor equilíbrio entre qualidade, proximidade e custo para pequenos negócios.</p>
<h3>Agência</h3>
<p>Uma agência junta várias pessoas (gestão de projeto, design, desenvolvimento, conteúdos), o que faz sentido para projetos grandes ou complexos. Essa estrutura reflete-se no preço.</p>

<h2>O que faz o preço subir ou descer</h2>
<ul>
  <li><strong>Número de páginas</strong> e de modelos de página diferentes.</li>
  <li><strong>Design à medida ou modelo adaptado</strong>: um design pensado para o seu negócio exige mais trabalho do que ajustar um modelo existente.</li>
  <li><strong>Conteúdos</strong>: quem escreve os textos e quem trata das fotografias.</li>
  <li><strong>Funcionalidades e integrações</strong>: marcações, formulários avançados, WhatsApp, chatbot, ferramentas de gestão de contactos, loja online.</li>
  <li><strong>Idiomas</strong>: cada idioma adicional é, na prática, mais uma versão do site.</li>
  <li><strong>SEO e migração</strong>: preservar posições ao substituir um site existente exige planeamento.</li>
</ul>

<h2>O que deve estar incluído numa proposta</h2>
<p>Ao comparar propostas, confirme se cada uma inclui:</p>
<ul>
  <li>Design adaptado a telemóvel, tablet e computador.</li>
  <li>O número de páginas e de rondas de revisão.</li>
  <li>Quem é responsável pelos conteúdos.</li>
  <li>SEO base: títulos, descrições, redirecionamentos e dados estruturados.</li>
  <li>Configuração de estatísticas.</li>
  <li>Publicação do site e formação para o poder editar.</li>
  <li>A propriedade do domínio e do site em seu nome.</li>
  <li>O apoio depois do lançamento: o que está incluído e durante quanto tempo.</li>
</ul>

<h2>Custos recorrentes a não esquecer</h2>
<p>Além do valor inicial, um site tem custos anuais: o domínio, o alojamento, eventuais licenças ou plugins e, se optar por isso, um serviço de manutenção. Peça que estes valores fiquem claros desde o início.</p>

<h2>Como organizo os meus preços</h2>
<p>Para dar uma referência concreta, é assim que organizo os meus preços:</p>
<ul>
  <li><strong>Nova Imagem, 750€</strong>: novo design mantendo a estrutura e os conteúdos atuais, otimizado para mobile e publicado. Para sites até 4 páginas; sites maiores, valor sob consulta.</li>
  <li><strong>Motor de Contactos, a partir de 1 800€</strong>: design e estrutura à medida, otimização para Google e ferramentas de IA, formulários e questionários, follow-ups automáticos, WhatsApp e painel de métricas. O valor final depende dos extras que escolher, como um chatbot com IA ou pagamentos online.</li>
</ul>
<p>Ainda não tem a certeza? Posso <a href="../../#free">fazer o redesign da sua homepage gratuitamente</a> e enviar-lhe por email um relatório personalizado com pontos a otimizar, para ver o potencial antes de investir. Encontra o detalhe de cada plano na <a href="../../#solutions">secção de planos</a>.</p>

<h2>Custo ou investimento?</h2>
<p>A melhor forma de avaliar um site é compará-lo com o que pode gerar. Se um cliente novo vale, em média, 500€ para o seu negócio, um site de 1 800€ paga-se com quatro clientes. A partir daí, cada contacto que o site traz é retorno.</p>
<p>Faça esta conta com os números do seu negócio: ajuda a decidir quanto faz sentido investir e o que deve pedir ao site em troca.</p>
""",
"faq": [
  ("Porque é que há propostas tão diferentes para o mesmo site?",
   "Porque raramente descrevem o mesmo trabalho. Diferenças no número de páginas, no design à medida, nos conteúdos, nas integrações e no apoio depois do lançamento explicam a maior parte da variação."),
  ("O site fica em meu nome?",
   "Deve ficar. Confirme que o domínio está registado em seu nome e que recebe todos os acessos no fim do projeto."),
  ("Preciso de pagar manutenção?",
   "Depende da plataforma e das integrações. Sites com muitos plugins exigem atualizações regulares de segurança; sites mais simples precisam de pouca manutenção técnica, mas beneficiam de conteúdos atualizados."),
],
},
]

# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
from _posts_en import POSTS_EN

MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July",
             "August", "September", "October", "November", "December"]
X_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13"/></svg>'

# Interface copy for both languages
UI = {
"pt": dict(
    html_lang="pt-PT", og_locale="pt_PT", skip="Saltar para o conteúdo", m_open="Abrir menu", m_close="Fechar menu", m_l1="Soluções", m_l2="Sobre", m_l3="Planos", m_l5="Contactos", home_label="Mariana Marcelino — página inicial", tagline="<span>Design</span><span>Automação</span><span>IA</span>",
    call="Marcar chamada", lang_label="Idioma",
    strip_region="Guia gratuito", strip_kicker="Gratuito", guide_title="8 sinais de que o seu site está a afastar clientes", foot_guide="Oito sinais de que o seu site está a afastar clientes",
    strip_go="Receber guia", close="Fechar",
    q_path="diagnostico/", q_strip="O seu site está a afastar clientes?", q_strip_go='Faça o teste<span class="promo-more"> em 2 minutos</span>', q_foot_label="Diagnóstico gratuito", q_foot="O seu site está a afastar clientes? Faça o teste em 2 minutos", q_404="Fazer o diagnóstico do meu site",
    g_kicker="Guia gratuito", g_sub="Um guia prático, com um teste rápido para cada sinal. Em poucos minutos percebe o que pode estar a custar-lhe contactos.",
    g_inc="O que vai encontrar", g_items=["Os oito sinais mais comuns, explicados sem jargão", "O que fazer e um teste rápido para cada um", "Uma grelha para decidir o próximo passo"],
    g_label="Pedido do guia gratuito", g_nosite="Ainda não tenho site", g_yes="Já tenho site", g_site_q="Tem site?", g_url="Insira o link para o seu site", g_email="Insira o seu email", g_btn="Receber o guia",
    g_note="Sem qualquer custo. Os seus dados servem apenas para este pedido.", privacy="Política de Privacidade",
    g_ok_t="Obrigada, já pode", g_dl="descarregar o guia", g_file="assets/guia-8-sinais.pdf", g_dl_name="Oito-sinais-de-que-o-seu-site-esta-a-afastar-clientes.pdf",
    cta_kicker="Contacto", cta_title="Comecemos com uma conversa",
    cta_sub="Identificamos oportunidades de melhoria no seu site e falamos sobre o caminho que faz sentido. Sem qualquer custo nem compromisso.",
    cta_write="Se preferir, envie uma mensagem", cta_aria="Formulário de contacto", f_name="Nome", f_msg="Mensagem", f_send="Enviar",
    foot_aria="Rodapé", legal_label="Informação legal", legal=[("politica-de-privacidade/", "Privacidade"), ("politica-de-cookies/", "Cookies"), ("termos-e-condicoes/", "Termos e Condições")], privacy_path="politica-de-privacidade/", updated="Última atualização",
    read="Ler artigo", min_read="min de leitura", role="Web Design, Programação, Conversão",
    toc="Neste artigo", summary="Em resumo", faq="Perguntas frequentes", faq_id="perguntas-frequentes", more="Continuar a ler", home_crumb="Início",
    bio=("Redesenho e reconstruo sites para que o seu negócio pareça o que realmente é: moderno e credível. "
         "Para que seja encontrado por quem o procura. E para que cada visitante tenha um caminho claro até se tornar cliente."),
    b_title="Vamos falar de presença digital", b_intro="Da ideia à conversão — e tudo o que acontece pelo meio.",
    b_meta_title="Blog | Mariana Marcelino — Sites, SEO e IA para pequenos negócios",
    b_meta_desc="Artigos práticos sobre design de sites, SEO, inteligência artificial e conversão, escritos para quem gere um negócio.",
    f_title="Explorar por tema", f_all="Todos", f_search="Pesquisar artigos", f_topics="Temas", f_empty="Nenhum artigo encontrado. Experimente outro tema ou outra palavra.",
),
"en": dict(
    html_lang="en", og_locale="en_GB", skip="Skip to content", m_open="Open menu", m_close="Close menu", m_l1="Solutions", m_l2="About", m_l3="Plans", m_l5="Contact", home_label="Mariana Marcelino — homepage", tagline="<span>Design</span><span>Automation</span><span>AI</span>",
    call="Book a call", lang_label="Language",
    strip_region="Free guide", strip_kicker="Free", guide_title="8 signs your website is driving clients away", foot_guide="Eight signs your website is driving clients away",
    strip_go="Get the guide", close="Close",
    q_path="en/diagnosis/", q_strip="Is your website driving clients away?", q_strip_go='Take the <span class="promo-more">2-minute </span>test', q_foot_label="Free diagnosis", q_foot="Is your website driving clients away? Take the 2-minute test", q_404="Diagnose my website",
    g_kicker="Free guide", g_sub="A practical guide with a quick test for each sign. In a few minutes you’ll see what might be costing you enquiries.",
    g_inc="What’s inside", g_items=["The eight most common signs, explained without jargon", "What to do, and a quick test for each one", "A simple way to decide your next step"],
    g_label="Free guide request", g_nosite="I don't have one yet", g_yes="I have a website", g_site_q="Do you have a website?", g_url="Enter your website link", g_email="Enter your email", g_btn="Get the guide",
    g_note="Completely free. Your details are only used for this request.", privacy="Privacy Policy",
    g_ok_t="Thanks! You can now", g_dl="download the guide", g_file="assets/guide-8-signs.pdf", g_dl_name="Eight-signs-your-website-is-driving-clients-away.pdf",
    cta_kicker="Contact", cta_title="Let's start with a conversation",
    cta_sub="We'll look at where your website could do better and talk through the right next step. No cost, no commitment.",
    cta_write="Prefer to write? Send a message", cta_aria="Contact form", f_name="Name", f_msg="Message", f_send="Send",
    foot_aria="Footer", legal_label="Legal", legal=[("en/privacy-policy/", "Privacy"), ("en/cookie-policy/", "Cookies"), ("en/terms-and-conditions/", "Terms &amp; Conditions")], privacy_path="en/privacy-policy/", updated="Last updated",
    read="Read article", min_read="min read", role="Web Design, Development, Conversion",
    toc="In this article", summary="Key takeaways", faq="Frequently asked questions", faq_id="faq", more="Keep reading", home_crumb="Home",
    bio=("I redesign and rebuild websites so your business looks the way it really is: modern and credible. "
         "So the people looking for it can find it. And so every visitor has a clear path to becoming a client."),
    b_title="Let’s talk digital presence", b_intro="From idea to conversion — and everything in between.",
    b_meta_title="Blog | Mariana Marcelino — Websites, SEO and AI for small businesses",
    b_meta_desc="Practical articles on web design, SEO, artificial intelligence and conversion, written for people who run a business.",
    f_title="Explore by topic", f_all="All", f_search="Search articles", f_topics="Topics", f_empty="No articles found. Try another topic or word.",
),
}
AVATAR = "assets/mariana-about.webp?v=2"


def esc(s):
    return html.escape(s, quote=True)

def slugify(text):
    t = unicodedata.normalize("NFKD", re.sub(r"<[^>]+>", "", text)).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()
    return re.sub(r"^\d+-", "", t) or "secao"

def fmt_date(iso, lang="pt"):
    y, m, d = iso.split("-")
    if lang == "en":
        return f"{int(d)} {MONTHS_EN[int(m) - 1]} {y}"
    return f"{int(d)} de {MONTHS[int(m) - 1]} de {y}"

pt_date = fmt_date

def reading_minutes(post):
    text = re.sub(r"<[^>]+>", " ", post["body"]) + " ".join(a for q, a in post["faq"]) + " ".join(post["takeaways"])
    return max(1, round(len(text.split()) / 200))

def add_heading_ids(body):
    toc, used = [], set()
    def repl(m):
        text = m.group(1)
        sid = slugify(text)
        while sid in used:
            sid += "-2"
        used.add(sid)
        toc.append((sid, re.sub(r"<[^>]+>", "", text)))
        return f'<h2 id="{sid}">{text}</h2>'
    return re.sub(r"<h2>(.*?)</h2>", repl, body), toc

def home_of(prefix, lang):
    return prefix + ("en/" if lang == "en" else "")

def lang_switch(lang, alt, label):
    if lang == "en":
        return f'''<div class="lang-switch" aria-label="{label}">
          <a href="{alt}" hreflang="pt-PT" lang="pt-PT" class="lang-link">PT</a>
          <span class="lang-sep" aria-hidden="true">|</span>
          <span class="lang-current" aria-current="true">EN</span>
        </div>'''
    return f'''<div class="lang-switch" aria-label="{label}">
          <span class="lang-current" aria-current="true">PT</span>
          <span class="lang-sep" aria-hidden="true">|</span>
          <a href="{alt}" hreflang="en" lang="en" class="lang-link">EN</a>
        </div>'''

def header(prefix, current="blog", lang="pt", alt=None, strip=True):
    u = UI[lang]
    home = home_of(prefix, lang)
    if alt is None:
        alt = prefix if lang == "en" else prefix + "en/"
    # The diagnosis page itself has no strip (it would link to itself)
    promo = f"""  <!-- Lead magnet strip -->
  <div class="promo-strip" role="region" aria-label="{u['q_foot_label']}">
    <a class="promo-link" href="{prefix}{u['q_path']}"><span class="promo-text">{u['q_strip']}</span><span class="promo-go"><span class="ul">{u['q_strip_go']}</span> <span class="arrow">→</span></span></a>
  </div>
""" if strip else ""
    # The same strip stays at the top of the open mobile menu, so the test is always one tap away
    menu_strip = f"""    <div class="menu-strip"><a class="promo-link js-menu-link" href="{prefix}{u['q_path']}"><span class="promo-text">{u['q_strip']}</span><span class="promo-go"><span class="ul">{u['q_strip_go']}</span> <span class="arrow">→</span></span></a></div>
""" if strip else ""
    return f"""  <a class="skip-link" href="#main">{u['skip']}</a>
{promo}
  <header class="header">
    <nav class="navigation grid-col-t grid-col-b grid-col-l grid-col-r h4">
      <a href="{home}" class="logo-container" aria-label="{u['home_label']}">
        <span class="logo">MARIANA MARCELINO</span>
        <span class="logo-tagline" aria-hidden="true">{u['tagline']}</span>
      </a>
      <div class="nav-right">
        {lang_switch(lang, alt, u['lang_label'])}
        <a href="{home}blog/" class="nav-link-plain"{' aria-current="page"' if current == "blog" else ""}>Blog</a>
        <span class="nav-cta nav-cta-spacer" aria-hidden="true">{u['call']}</span>
        <a href="{CALENDLY}" target="_blank" rel="noopener" class="nav-cta nav-cta-fixed">{u['call']}</a>
        <button type="button" class="nav-burger js-menu-open" aria-label="{u['m_open']}" aria-controls="mobile-menu" aria-expanded="false"><span></span><span></span></button>
      </div>
    </nav>
  </header>

  <!-- Mobile menu -->
  <div class="mobile-menu js-mobile-menu" id="mobile-menu" hidden>
{menu_strip}    <div class="mobile-menu-top">
      <span class="logo">MARIANA MARCELINO</span>
      <button type="button" class="mobile-menu-close js-menu-close" aria-label="{u['m_close']}">{X_ICON}</button>
    </div>
    <nav class="mobile-menu-links" aria-label="Menu">
      <a href="{home}#solutions" class="js-menu-link">{u['m_l1']}</a>
      <a href="{home}#about" class="js-menu-link">{u['m_l2']}</a>
      <a href="{home}#cta" class="js-menu-link">{u['m_l5']}</a>
      <a href="{home}blog/" class="js-menu-link">Blog</a>
    </nav>
    <a href="{CALENDLY}" target="_blank" rel="noopener" class="mobile-menu-cta"><span class="ul">{u['call']}</span> <span class="arrow"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5"/></svg></span></a>
    <div class="mobile-menu-foot">
      {lang_switch(lang, alt, u['lang_label'])}
    </div>
  </div>"""

def guide_modal(prefix, lang="pt"):
    u = UI[lang]
    items = "\n".join(f"          <li>{i}</li>" for i in u["g_items"])
    return f"""  <!-- Lead magnet popup -->
  <dialog class="modal js-modal" id="guide-modal" aria-labelledby="guide-modal-title">
    <div class="modal-head">
      <p class="kicker modal-pill">{u['g_kicker']}</p>
      <button type="button" class="modal-close js-close-modal" aria-label="{u['close']}">{X_ICON}</button>
    </div>
    <div class="modal-body">
      <h2 id="guide-modal-title" class="modal-title">{u['foot_guide']}</h2>
      <p class="modal-sub">{u['g_sub']}</p>
      <div class="modal-inc">
        <p class="modal-inc-label">{u['g_inc']}</p>
        <ol class="modal-list">
{items}
        </ol>
      </div>
    </div>
    <form class="js-guide-form form-free modal-form" aria-label="{u['g_label']}" novalidate>
      <input type="text" name="company" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="site-choice" role="radiogroup" aria-label="{u['g_site_q']}"><label class="radio"><input type="radio" name="HasSite" value="yes" checked><span>{u['g_yes']}</span></label><label class="radio"><input type="radio" name="HasSite" value="no" class="js-nosite"><span>{u['g_nosite']}</span></label></div>
      <div class="url-slot"><div><input type="text" name="URL" class="input" placeholder="{u['g_url']}" required autocomplete="url"></div></div>
      <input type="email" name="Email" class="input" placeholder="{u['g_email']}" required autocomplete="email">
      <button type="submit" class="button">{u['g_btn']}</button>
      <p class="js-form-message message" role="status"></p>
      <p class="modal-note">{u['g_note']} <a href="{prefix}{u['privacy_path']}">{u['privacy']}</a></p>
    </form>
    <div class="modal-success js-guide-success" hidden>
      <p class="modal-success-title">{u['g_ok_t']} <a class="guide-dl" href="{prefix}{u['g_file']}" download="{u['g_dl_name']}"><span class="ul">{u['g_dl']}</span>&nbsp;<span class="arrow" aria-hidden="true">↓</span></a></p>
    </div>
  </dialog>

"""

def cta(prefix, lang="pt"):
    u = UI[lang]
    return f"""    <section class="cta-section">
      <div class="cta-panel" data-strip-hide>
        <div class="cta-inner">
        <h2 class="cta-title">{u['cta_title']}</h2>
        <p class="cta-sub">{u['cta_sub']}</p>
        <div class="cta-main">
          <a href="{CALENDLY}" target="_blank" rel="noopener" class="button cta-button">{u['call']}</a>
        </div>
        <div class="cta-write">
          <button type="button" class="cta-write-toggle js-write-toggle" aria-expanded="false" aria-controls="cta-form"><span class="cta-write-text">{u['cta_write']}</span><span class="cta-write-arrow" aria-hidden="true">→</span></button>
          <form id="cta-form" class="js-contact-form cta-form" hidden aria-label="{u['cta_aria']}" novalidate>
      <input type="text" name="company" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
            <label class="cta-field"><span>{u['f_name']}</span><input type="text" name="Nome" autocomplete="name"></label>
            <label class="cta-field"><span>Email</span><input type="email" name="Email" required autocomplete="email"></label>
            <label class="cta-field -full"><span>{u['f_msg']}</span><textarea name="Mensagem" rows="3" required></textarea></label>
            <div class="cta-form-foot">
              <button type="submit" class="button">{u['f_send']}</button>
              <p class="js-form-message message" role="status"></p>
            </div>
          </form>
        </div>
      </div>
      </div>
    </section>"""

def footer(prefix, lang="pt", alt=None, guide=True):
    u = UI[lang]
    home = home_of(prefix, lang)
    if alt is None:
        alt = prefix if lang == "en" else prefix + "en/"
    legal = "\n".join(f'        <a href="{prefix}{href}" class="link">{label}</a>' for href, label in u["legal"])
    # Left out on the diagnosis page itself (it would link to itself)
    guide_link = f"""
      <a class="footer-guide" href="{prefix}{u['q_path']}"><span class="footer-guide-label">{u['q_foot_label']}</span><span class="footer-guide-title"><span class="ul">{u['q_foot']}</span>&nbsp;<span class="arrow" aria-hidden="true">→</span></span></a>""" if guide else ""
    return f"""  <footer class="footer -bg-black -fg-off-white" data-nav="dark" data-nav-hide>
    <div class="footer-top footer-row">
      <div class="footer-brand">
        <a href="{home}" class="logo footer-logo">MARIANA MARCELINO</a>
        <a href="mailto:info@mariana-marcelino.com" class="footer-email">info@mariana-marcelino.com</a>
      </div>{guide_link}
      <nav class="footer-links" aria-label="{u['foot_aria']}">
        {lang_switch(lang, alt, u['lang_label'])}
        <a href="{home}blog/" class="nav-link-plain">Blog</a>
        <a href="{CALENDLY}" target="_blank" rel="noopener" class="nav-cta">{u['call']}</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Mariana Marcelino</p>
      <div class="footer-legal">
        <button type="button" class="footer-legal-toggle js-legal-toggle" aria-expanded="false" aria-controls="footer-legal-links">{u['legal_label']} <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></button>
        <div class="footer-legal-links" id="footer-legal-links"><div>
{legal}
        </div></div>
      </div>
    </div>
  </footer>"""

def head(title, description, canonical, image, prefix, og_type, jsonld, lang="pt", alternates=None):
    u = UI[lang]
    # Search results show ~60 characters: long titles go without the brand suffix
    if len(title) > 62 and title.endswith(" | Mariana Marcelino"):
        title = title[: -len(" | Mariana Marcelino")]
    ld = "\n".join(f'  <script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in jsonld)
    alt_links = ""
    alt_locale = ""
    if alternates:
        alt_locale = f'\n  <meta property="og:locale:alternate" content="{UI["en" if lang == "pt" else "pt"]["og_locale"]}">'
    if alternates:
        alt_links = "\n" + "\n".join(f'  <link rel="alternate" hreflang="{hl}" href="{href}">' for hl, href in alternates)
    return f"""<!doctype html>
<html lang="{u['html_lang']}">
<head>
  <meta charset="utf-8">
  <script>if("IntersectionObserver"in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("js-reveal")</script>
  <script>try{{if(sessionStorage.getItem("pt")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("pt-enter");sessionStorage.removeItem("pt")}}catch(e){{}}</script>
  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="author" content="Mariana Marcelino">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="{canonical}">{alt_links}
  <link rel="alternate" type="text/plain" title="llms.txt" href="{SITE}/llms.txt">

  <meta property="og:type" content="{og_type}">
  <meta property="og:locale" content="{u['og_locale']}">{alt_locale}
  <meta property="og:site_name" content="Mariana Marcelino">
  <meta property="og:url" content="{canonical}">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:image" content="{image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(description)}">
  <meta name="twitter:image" content="{image}">

  <link rel="icon" href="{prefix}favicon.ico?v=3" sizes="any">
  <link rel="icon" href="{prefix}assets/favicon.svg?v=3" type="image/svg+xml">
  <link rel="icon" href="{prefix}assets/favicon-32.png?v=3" type="image/png" sizes="32x32">
  <link rel="icon" href="{prefix}assets/favicon-16.png?v=3" type="image/png" sizes="16x16">
  <link rel="icon" href="{prefix}assets/icon-192.png?v=3" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="{prefix}assets/apple-touch-icon.png?v=3">
  <link rel="manifest" href="{prefix}site.webmanifest">

  <link rel="preload" href="{prefix}assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="{prefix}styles.css?v={VERSION}">
  <link rel="stylesheet" href="{prefix}blog/blog.css?v={VERSION}">
{ld}
  <script defer src="https://cdn.vercel-insights.com/v1/script.js"></script>
  <script defer src="https://cloud.umami.is/script.js" data-website-id="e16bf8ca-8f63-460a-98d2-acdfd1d34cc4"></script>
</head>"""

PERSON = {
    "@type": "Person",
    "@id": f"{SITE}/#mariana",
    "name": "Mariana Marcelino",
    "url": f"{SITE}/",
    "image": f"{SITE}/{AVATAR}",
    "jobTitle": "Web designer e developer",
    "sameAs": [LINKEDIN],
}
PUBLISHER = {
    "@type": "Organization",
    "@id": f"{SITE}/#business",
    "name": "Mariana Marcelino",
    "url": f"{SITE}/",
    "logo": {"@type": "ImageObject", "url": f"{SITE}/assets/apple-touch-icon.png"},
}

def posts_for(lang):
    """Posts in `lang`, each merged with the shared fields (date, cover) and its pair."""
    out = []
    for pt, en in zip(POSTS, POSTS_EN):
        base = pt if lang == "pt" else {**pt, **en}
        out.append({**base, "pair_pt": pt["slug"], "pair_en": en["slug"]})
    return out

def search_text(post):
    t = f"{post['title']} {post['description']} {post['category']}"
    return unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode().lower()

def card(post, prefix, feature=False, lang="pt"):
    u = UI[lang]
    url = f"{home_of(prefix, lang)}blog/{post['slug']}/"
    data = f' data-cats="{" ".join(slugify(t) for t in topics_of(post))}" data-text="{esc(search_text(post))}"'
    meta = f"""<p class="post-meta"><span class="post-cat">{esc(post['category'])}</span><time datetime="{post['date']}">{fmt_date(post['date'], lang)}</time><span>{reading_minutes(post)} min</span></p>"""
    base = f"{prefix}assets/blog/{post['cover']}"
    sizes = "(min-width: 860px) 56vw, 100vw" if feature else "(min-width: 860px) 46vw, 100vw"
    img = f"""<img src="{base}-sm.webp?v={VERSION}" srcset="{base}-sm.webp?v={VERSION} 800w, {base}.webp?v={VERSION} 1400w" sizes="{sizes}" alt="{esc(post['cover_alt'])}" width="{1400 if feature else 800}" height="{875 if feature else 500}" {'fetchpriority="high"' if feature else 'loading="lazy"'} decoding="async" class="fade-on-load">"""
    if feature:
        return f"""      <article class="post-card post-feature js-post"{data}>
        <a href="{url}" class="post-media" tabindex="-1" aria-hidden="true">{img}</a>
        <div class="post-feature-text">
          {meta}
          <h2 class="post-title"><a href="{url}">{esc(post['title'])}</a></h2>
          <p class="post-excerpt">{esc(post['description'])}</p>
          <a href="{url}" class="more-link">{u['read']}<svg viewBox="0 0 56 12" aria-hidden="true"><path d="M0 6h54M48 1l6 5-6 5"/></svg></a>
        </div>
      </article>"""
    return f"""        <article class="post-card js-post"{data}>
          <a href="{url}" class="post-media" tabindex="-1" aria-hidden="true">{img}</a>
          {meta}
          <h3 class="post-title"><a href="{url}">{esc(post['title'])}</a></h3>
          <p class="post-excerpt">{esc(post['description'])}</p>
        </article>"""

def topics_of(post):
    """The article's topics for the blog filters: its category first, then any extra topics."""
    return [post["category"]] + [t for t in post.get("topics", []) if t != post["category"]]


def filters(posts, lang):
    u = UI[lang]
    cats = []
    for p in posts:
        for t in topics_of(p):
            if t not in cats:
                cats.append(t)
    chips = "\n".join(
        f'          <button type="button" class="chip js-chip" data-filter="{slugify(c)}" aria-pressed="false"><span class="chip-icon" aria-hidden="true"></span>{esc(c)}</button>'
        for c in cats)
    return f"""    <section class="blog-filters" aria-label="{u['f_title']}">
      <h2 class="filters-title">{u['f_title']}</h2>
      <div class="filters-row">
        <div class="filters-chips" role="group" aria-label="{u['f_topics']}">
          <button type="button" class="chip js-chip is-active" data-filter="all" aria-pressed="true">{u['f_all']}</button>
{chips}
        </div>
        <label class="filters-search">
          <span class="visually-hidden">{u['f_search']}</span>
          <input type="search" class="js-post-search" placeholder="{u['f_search']}" autocomplete="off">
          <span class="filters-search-icon" aria-hidden="true"><svg viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg></span>
        </label>
      </div>
    </section>"""

# --------------------------------------------------------------------------
# Blog index
# --------------------------------------------------------------------------
def blog_url(lang, slug=None):
    base = f"{SITE}/blog/" if lang == "pt" else f"{SITE}/en/blog/"
    return base + (f"{slug}/" if slug else "")

def build_index(lang="pt"):
    u = UI[lang]
    posts = posts_for(lang)
    prefix = "../" if lang == "pt" else "../../"
    canonical = blog_url(lang)
    alternates = [("pt-PT", blog_url("pt")), ("en", blog_url("en")), ("x-default", blog_url("pt"))]
    alt = "../en/blog/" if lang == "pt" else "../../blog/"
    jsonld = [{
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": canonical,
        "name": "Blog — Mariana Marcelino",
        "description": u["b_meta_desc"],
        "url": canonical,
        "inLanguage": u["html_lang"],
        "author": PERSON,
        "publisher": PUBLISHER,
        "blogPost": [{
            "@type": "BlogPosting",
            "headline": p["title"],
            "url": blog_url(lang, p["slug"]),
            "datePublished": p["date"],
            "image": f"{SITE}/assets/blog/{p['cover']}-og.jpg",
        } for p in posts],
    }]
    grid = "\n".join(card(p, prefix, lang=lang) for p in posts[1:])
    page = f"""{head(u['b_meta_title'], u['b_meta_desc'], canonical, f"{SITE}/assets/blog/{posts[0]['cover']}-og.jpg", prefix, "website", jsonld, lang, alternates)}
<body>

{header(prefix, "blog", lang, alt)}

  <main class="blog-main" id="main">
    <section class="blog-head">
      <p class="kicker blog-kicker">Blog</p>
      <div class="narrow-container">
        <h1 class="blog-title">{u['b_title']}</h1>
        <p class="blog-intro">{u['b_intro']}</p>
      </div>
    </section>

    <div class="post-list js-post-list">
{filters(posts, lang)}

{card(posts[0], prefix, feature=True, lang=lang)}

      <div class="post-grid">
{grid}
      </div>
      <p class="posts-empty js-posts-empty" hidden>{u['f_empty']}</p>
    </div>

{cta(prefix, lang)}
  </main>

{footer(prefix, lang, alt)}

  <script src="{prefix}assets/vendor/lenis.min.js?v=1.3.26"></script>
  <script src="{prefix}main.js?v={VERSION}"></script>
</body>
</html>
"""
    out = os.path.join(ROOT, "blog") if lang == "pt" else os.path.join(ROOT, "en", "blog")
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(page)

# --------------------------------------------------------------------------
# Articles
# --------------------------------------------------------------------------
def build_post(i, post, lang="pt"):
    u = UI[lang]
    posts = posts_for(lang)
    prefix = "../../" if lang == "pt" else "../../../"
    home = home_of(prefix, lang)
    canonical = blog_url(lang, post["slug"])
    alternates = [("pt-PT", blog_url("pt", post["pair_pt"])), ("en", blog_url("en", post["pair_en"])), ("x-default", blog_url("pt", post["pair_pt"]))]
    alt = f"../../en/blog/{post['pair_en']}/" if lang == "pt" else f"../../../blog/{post['pair_pt']}/"
    image = f"{SITE}/assets/blog/{post['cover']}-og.jpg"
    body, toc = add_heading_ids(post["body"])
    minutes = reading_minutes(post)

    takeaways = "\n".join(f"              <li>{esc(t)}</li>" for t in post["takeaways"])
    faq_html = "\n".join(f"""            <details>
              <summary>{esc(q)}</summary>
              <p>{esc(a)}</p>
            </details>""" for q, a in post["faq"])
    toc_html = "\n".join(f'              <li><a href="#{sid}">{esc(t)}</a></li>' for sid, t in toc)
    toc_html += f'\n              <li><a href="#{u["faq_id"]}">{u["faq"]}</a></li>'

    others = [p for p in posts if p["slug"] != post["slug"]]
    related = [others[(i) % len(others)], others[(i + 1) % len(others)]]
    related_html = "\n".join(card(p, prefix, lang=lang) for p in related)

    jsonld = [
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": f"{canonical}#article",
            "mainEntityOfPage": canonical,
            "headline": post["title"],
            "description": post["description"],
            "abstract": " ".join(post["takeaways"]),
            "image": [image, f"{SITE}/assets/blog/{post['cover']}.jpg"],
            "datePublished": post["date"],
            "dateModified": post["date"],
            "inLanguage": u["html_lang"],
            "articleSection": post["category"],
            "wordCount": len(re.sub(r"<[^>]+>", " ", post["body"]).split()),
            "timeRequired": f"PT{minutes}M",
            "author": PERSON,
            "publisher": PUBLISHER,
            "isPartOf": {"@type": "Blog", "@id": blog_url(lang)},
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            } for q, a in post["faq"]],
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": u["home_crumb"], "item": f"{SITE}/" if lang == "pt" else f"{SITE}/en/"},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": blog_url(lang)},
                {"@type": "ListItem", "position": 3, "name": post["title"], "item": canonical},
            ],
        },
    ]

    page = f"""{head(f"{post['title']} | Mariana Marcelino", post["description"], canonical, image, prefix, "article", jsonld, lang, alternates)}
<body>

{header(prefix, "blog", lang, alt)}

  <main class="blog-main" id="main">
    <article>
      <header class="blog-head article-head">
        <p class="kicker blog-kicker"><a href="{home}blog/">← Blog</a></p>
        <div class="narrow-container">
          <p class="post-meta"><span class="post-cat">{esc(post['category'])}</span><time datetime="{post['date']}">{fmt_date(post['date'], lang)}</time><span>{minutes} {u['min_read']}</span></p>
          <h1 class="article-title">{esc(post['title'])}</h1>
          <p class="article-dek">{esc(post['dek'])}</p>
          <div class="article-byline">
            <img src="{prefix}assets/mariana-avatar.webp?v=2" alt="" width="40" height="40">
            <p>Mariana Marcelino<span>{u['role']}</span></p>
          </div>
          <figure class="article-cover">
            <img src="{prefix}assets/blog/{post['cover']}.webp?v={VERSION}" srcset="{prefix}assets/blog/{post['cover']}-sm.webp?v={VERSION} 800w, {prefix}assets/blog/{post['cover']}.webp?v={VERSION} 1400w" sizes="(min-width: 1200px) 60vw, 100vw" alt="{esc(post['cover_alt'])}" width="1400" height="875" fetchpriority="high" decoding="async">
          </figure>
        </div>
      </header>

      <div class="article-layout">
        <aside class="article-toc" aria-label="{u['toc']}">
          <div class="article-toc-inner">
            <p class="kicker">{u['toc']}</p>
            <ol>
{toc_html}
            </ol>
          </div>
        </aside>

        <div class="narrow-container article-body">
          <div class="prose">
            <section class="takeaways" aria-label="{u['summary']}">
              <p class="kicker">{u['summary']}</p>
              <ul>
{takeaways}
              </ul>
            </section>
{body.strip()}

            <section class="faq">
              <h2 id="{u['faq_id']}">{u['faq']}</h2>
{faq_html}
            </section>

            <aside class="author-box">
              <img src="{prefix}assets/mariana-avatar.webp?v=2" alt="Mariana Marcelino" width="64" height="64" loading="lazy" decoding="async">
              <div>
                <p class="author-name">Mariana Marcelino</p>
                <p>{esc(u['bio'])} <a href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>

    <section class="post-list related" aria-label="{u['more']}">
      <p class="kicker">{u['more']}</p>
      <div class="post-grid">
{related_html}
      </div>
    </section>

{cta(prefix, lang)}
  </main>

{footer(prefix, lang, alt)}

  <script src="{prefix}assets/vendor/lenis.min.js?v=1.3.26"></script>
  <script src="{prefix}main.js?v={VERSION}"></script>
</body>
</html>
"""
    base = os.path.join(ROOT, "blog") if lang == "pt" else os.path.join(ROOT, "en", "blog")
    d = os.path.join(base, post["slug"])
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(page)

# --------------------------------------------------------------------------
# Legal pages (served at /politica-de-privacidade/, /politica-de-cookies/,
# /termos-e-condicoes/)
# --------------------------------------------------------------------------
LEGAL_UPDATED = "2026-09-30"

LEGAL = [
{
"slug": "politica-de-privacidade",
"title": "Política de Privacidade",
"description": "Como são recolhidos, usados e protegidos os seus dados pessoais no site de Mariana Marcelino.",
"body": """
<p>Esta política explica que dados pessoais recolho através deste site, para que os uso, que serviços os tratam em meu nome e que direitos tem sobre eles, nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD).</p>

<h2>Responsável pelo tratamento</h2>
<p>Mariana Marcelino é a responsável pelo tratamento dos dados recolhidos neste site. Para qualquer questão sobre privacidade, escreva para <a href="mailto:info@mariana-marcelino.com">info@mariana-marcelino.com</a>.</p>

<h2>Que dados recolho</h2>
<ul>
  <li><strong>Pedido de redesign gratuito:</strong> o endereço de email e o link do seu site, que indica nos formulários da homepage.</li>
  <li><strong>Diagnóstico do site:</strong> as respostas que dá ao diagnóstico gratuito, o endereço do seu site (se o indicar) e, se pedir o relatório completo, o seu endereço de email.</li>
  <li><strong>Formulário de contacto e email:</strong> o seu nome (opcional), o endereço de email e a informação que decidir partilhar na mensagem.</li>
  <li><strong>Chat:</strong> se usar o assistente de chat do site, as mensagens que escreve. A conversa fica guardada apenas no seu browser enquanto o separador estiver aberto. Se escolher “Enviar conversa por email”, recebo a conversa e o email que indicar.</li>
  <li><strong>Marcação de chamadas:</strong> quando clica em “Marcar chamada”, o calendário do Calendly abre numa janela dentro deste site, onde indica o seu nome, email e outras informações que o formulário de marcação pedir.</li>
  <li><strong>Dados técnicos:</strong> como em qualquer site, o seu browser transmite automaticamente o endereço IP e informação técnica ao servidor de alojamento e, quando os usa, aos serviços de terceiros integrados na página, como o calendário de marcação.</li>
</ul>
<p>Não recolho categorias especiais de dados e este site não se destina a menores de 16 anos.</p>

<h2>Para que uso os seus dados</h2>
<ul>
  <li>Responder ao seu pedido, preparar o redesign gratuito e a proposta que solicitou e enviar o relatório do diagnóstico. Fundamento: diligências pré-contratuais a seu pedido (artigo 6.º, n.º 1, alínea b) do RGPD).</li>
  <li>Prestar os serviços contratados e cumprir obrigações legais, como a faturação. Fundamento: execução de contrato e cumprimento de obrigação legal.</li>
  <li>Garantir o funcionamento e a segurança do site e medir as visitas de forma anónima, para o melhorar. Fundamento: interesse legítimo.</li>
</ul>
<p>Não uso os seus dados para publicidade nem os vendo a terceiros.</p>

<h2>Serviços que uso para o site funcionar</h2>
<p>Não partilho os seus dados para serem usados por terceiros. Para o site funcionar, uso alguns serviços técnicos que tratam dados apenas em meu nome e só para a finalidade indicada:</p>
<ul>
  <li><strong>Envio de emails:</strong> Resend (resend.com) envia a mensagem que recebo e a confirmação que lhe chega quando usa um formulário. O Web3Forms (web3forms.com) só entra em funcionamento se o Resend falhar.</li>
  <li><strong>Estatísticas de visitas:</strong> o Vercel Web Analytics (vercel.com) e o Umami (umami.is) contam as visitas de forma anónima e agregada. Não usam cookies, não guardam o seu endereço IP e não o identificam.</li>
  <li><strong>Assistente de chat:</strong> se usar o chat, as suas mensagens são processadas pelo Claude, da Anthropic (anthropic.com), apenas para gerar as respostas. As conversas não são usadas para treinar modelos de IA, e o chat não lhe pede dados pessoais.</li>
  <li><strong>Marcação de chamadas:</strong> o calendário do Calendly (calendly.com) só é carregado quando clica em “Marcar chamada”. A partir daí, os dados que indica são tratados pelo Calendly, segundo a política de privacidade deles.</li>
  <li><strong>Email e alojamento:</strong> o meu fornecedor de email guarda as mensagens que recebo, e o servidor de alojamento serve as páginas do site.</li>
</ul>
<p>Alguns destes serviços estão sediados fora da União Europeia, nomeadamente nos Estados Unidos. Nesses casos, os dados são protegidos pelas garantias previstas no RGPD, como as cláusulas contratuais-tipo da Comissão Europeia ou o Quadro de Privacidade de Dados UE-EUA.</p>

<h2>Durante quanto tempo guardo os dados</h2>
<ul>
  <li>Pedidos de redesign gratuito e contactos que não resultem em trabalho: até 12 meses após o último contacto.</li>
  <li>Dados de clientes: durante a relação contratual e, depois disso, pelo prazo exigido por lei, por exemplo para efeitos fiscais.</li>
</ul>

<h2>Os seus direitos</h2>
<p>Pode, a qualquer momento, pedir o acesso aos seus dados, a sua retificação ou apagamento, a limitação ou oposição ao tratamento e a portabilidade dos dados. Basta escrever para <a href="mailto:info@mariana-marcelino.com">info@mariana-marcelino.com</a>. Respondo no prazo máximo de um mês.</p>
<p>Tem também o direito de apresentar reclamação à autoridade de controlo, a Comissão Nacional de Proteção de Dados (<a href="https://www.cnpd.pt" target="_blank" rel="noopener">www.cnpd.pt</a>).</p>

<h2>Cookies</h2>
<p>Este site não usa cookies próprios. O Calendly pode definir cookies quando abre o calendário de marcação. Pode ler os detalhes na <a href="../politica-de-cookies/">Política de Cookies</a>.</p>

<h2>Alterações a esta política</h2>
<p>Esta política pode ser atualizada, por exemplo, quando acrescentar novos serviços ao site. A data da última atualização está sempre indicada no topo desta página.</p>
""",
},
{
"slug": "politica-de-cookies",
"title": "Política de Cookies",
"description": "Que cookies e tecnologias semelhantes são usados no site de Mariana Marcelino.",
"body": """
<h2>O que são cookies</h2>
<p>Cookies são pequenos ficheiros de texto que um site guarda no seu dispositivo quando o visita. Servem, por exemplo, para lembrar preferências ou medir a utilização de um site.</p>

<h2>Cookies usados neste site</h2>
<p>Este site <strong>não usa cookies próprios</strong>, nem ferramentas de publicidade ou de acompanhamento. Para medir visitas usa o Vercel Web Analytics e o Umami, que funcionam sem cookies e de forma anónima.</p>
<p>Para funcionar, o site usa apenas o armazenamento temporário do seu browser, por exemplo para a transição entre páginas e para guardar a conversa do chat. É apagado quando fecha o separador.</p>
<p>A única exceção é o calendário de marcação do Calendly. Só é carregado quando clica em “Marcar chamada” e, a partir desse momento, o Calendly pode definir cookies para mostrar a disponibilidade e concluir a marcação, de acordo com a sua <a href="https://calendly.com/legal/privacy-notice" target="_blank" rel="noopener">política de privacidade</a>. Se o seu país o exigir, o próprio Calendly pede-lhe consentimento dentro do calendário. Pode apagar estes cookies a qualquer momento nas definições do seu browser. Se preferir não usar o Calendly, escreva para <a href="mailto:info@mariana-marcelino.com">info@mariana-marcelino.com</a> e combinamos a chamada por email.</p>

<h2>Alterações</h2>
<p>Se no futuro este site passar a usar cookies, por exemplo para estatísticas, esta política será atualizada e será pedido o seu consentimento antes de os ativar, sempre que a lei o exija.</p>
""",
},
{
"slug": "termos-e-condicoes",
"title": "Termos e Condições",
"description": "Condições de utilização do site e dos serviços de Mariana Marcelino.",
"body": """
<p>Ao utilizar este site, aceita os termos e condições descritos nesta página. Se não concordar com eles, não deve utilizar o site.</p>

<h2>Identificação</h2>
<p>Este site é gerido por Mariana Marcelino, que presta serviços de design e desenvolvimento de sites. Contacto: <a href="mailto:info@mariana-marcelino.com">info@mariana-marcelino.com</a>.</p>

<h2>Informação e preços</h2>
<p>A informação publicada neste site, incluindo descrições de serviços e preços, tem caráter indicativo. O âmbito, o preço e os prazos de cada projeto são definidos numa proposta escrita, enviada antes do início do trabalho. Só essa proposta, depois de aceite, vincula as partes.</p>

<h2>Redesign gratuito</h2>
<ul>
  <li>O pedido de redesign gratuito não implica qualquer custo nem compromisso de contratação.</li>
  <li>O redesign e o relatório são uma demonstração do potencial do seu site. Os direitos de utilização do design só são transmitidos mediante a contratação de um serviço.</li>
  <li>Posso recusar pedidos que não se enquadrem nos serviços que presto.</li>
</ul>

<h2>Propriedade intelectual</h2>
<p>Os textos, imagens, ilustrações, código e restantes conteúdos deste site pertencem a Mariana Marcelino ou são usados com autorização, e estão protegidos por direitos de autor. Não podem ser copiados, reproduzidos ou utilizados para fins comerciais sem autorização prévia por escrito. Os logótipos de clientes pertencem aos respetivos titulares.</p>

<h2>Utilização do site</h2>
<p>Compromete-se a utilizar o site de forma lícita e a não enviar, através dos formulários, conteúdos falsos, ofensivos ou que violem direitos de terceiros.</p>

<h2>Ligações externas</h2>
<p>Este site contém ligações para sites de terceiros, como o LinkedIn, e integra serviços de terceiros, como o calendário de marcação do Calendly. Não sou responsável pelo conteúdo nem pelas práticas de privacidade desses sites.</p>

<h2>Responsabilidade</h2>
<p>Procuro manter a informação deste site correta e atualizada, mas não garanto que esteja isenta de erros ou que o site esteja sempre disponível. Na medida permitida por lei, não sou responsável por danos resultantes da utilização do site ou da impossibilidade de o utilizar.</p>

<h2>Proteção de dados</h2>
<p>O tratamento dos seus dados pessoais está descrito na <a href="../politica-de-privacidade/">Política de Privacidade</a>.</p>

<h2>Lei aplicável e litígios</h2>
<p>Estes termos regem-se pela lei portuguesa. Em caso de litígio de consumo, pode recorrer a uma entidade de resolução alternativa de litígios de consumo. Mais informações no Portal do Consumidor (<a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener">www.consumidor.gov.pt</a>). Pode também usar o <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener">Livro de Reclamações Eletrónico</a>.</p>

<h2>Alterações</h2>
<p>Estes termos podem ser atualizados a qualquer momento. A data da última atualização está sempre indicada no topo desta página.</p>
""",
},
]


def build_legal():
    from _legal_en import LEGAL_EN
    for pt, en in zip(LEGAL, LEGAL_EN):
        pt_url, en_url = f"{SITE}/{pt['slug']}/", f"{SITE}/en/{en['slug']}/"
        alternates = [("pt-PT", pt_url), ("en", en_url), ("x-default", pt_url)]
        for lang, page in (("pt", pt), ("en", en)):
            u = UI[lang]
            prefix = "../" if lang == "pt" else "../../"
            alt = f"../en/{en['slug']}/" if lang == "pt" else f"../../{pt['slug']}/"
            canonical = pt_url if lang == "pt" else en_url
            body, _ = add_heading_ids(page["body"])
            jsonld = [{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": page["title"],
                "description": page["description"],
                "url": canonical,
                "inLanguage": u["html_lang"],
                "dateModified": LEGAL_UPDATED,
                "publisher": PUBLISHER,
            }]
            html_page = f"""{head(f"{page['title']} | Mariana Marcelino", page["description"], canonical, f"{SITE}/assets/{'og-image-en' if lang == 'en' else 'og-image'}.png", prefix, "website", jsonld, lang, alternates)}
<body>

{header(prefix, None, lang, alt)}

  <main class="blog-main" id="main">
    <article>
      <header class="blog-head article-head">
        <p class="kicker blog-kicker">Legal</p>
        <div class="narrow-container">
          <h1 class="article-title">{esc(page['title'])}</h1>
          <p class="post-meta legal-updated">{u['updated']}: <time datetime="{LEGAL_UPDATED}">{fmt_date(LEGAL_UPDATED, lang)}</time></p>
        </div>
      </header>
      <div class="narrow-container article-body">
        <div class="prose">
{body.strip()}
        </div>
      </div>
    </article>
  </main>

{footer(prefix, lang, alt)}

  <script src="{prefix}assets/vendor/lenis.min.js?v=1.3.26"></script>
  <script src="{prefix}main.js?v={VERSION}"></script>
</body>
</html>
"""
            d = os.path.join(ROOT, page["slug"]) if lang == "pt" else os.path.join(ROOT, "en", page["slug"])
            os.makedirs(d, exist_ok=True)
            open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(html_page)


# --------------------------------------------------------------------------
# Diagnosis quiz (/diagnostico/ and /en/diagnosis/): content in blog/_quiz.py
# --------------------------------------------------------------------------
QUIZ_META = {
    "pt": dict(title="Diagnóstico gratuito: o seu site está a trabalhar por si? | Mariana Marcelino",
               desc="Responda a 9 perguntas e descubra em 2 minutos o que está a funcionar no seu site, o que pode estar a afastar clientes e qual o próximo passo certo."),
    "en": dict(title="Free diagnosis: is your website working for you? | Mariana Marcelino",
               desc="Answer 9 questions and, in 2 minutes, find out what's working on your website, what might be driving clients away and the best next step."),
}


def build_quiz():
    import _quiz
    pt_url, en_url = f"{SITE}/diagnostico/", f"{SITE}/en/diagnosis/"
    alternates = [("pt-PT", pt_url), ("en", en_url), ("x-default", pt_url)]
    for lang in ("pt", "en"):
        u = UI[lang]
        Q = _quiz.QUIZ[lang]["ui"]
        prefix = "../" if lang == "pt" else "../../"
        alt = "../en/diagnosis/" if lang == "pt" else "../../diagnostico/"
        canonical = pt_url if lang == "pt" else en_url
        m = QUIZ_META[lang]
        jsonld = [{
            "@context": "https://schema.org", "@type": "WebPage", "name": Q["title"], "description": m["desc"],
            "url": canonical, "inLanguage": u["html_lang"], "publisher": PUBLISHER,
        }]
        page = f"""{head(m['title'], m['desc'], canonical, f"{SITE}/assets/{'og-image-en' if lang == 'en' else 'og-image'}.png", prefix, "website", jsonld, lang, alternates)}
<body>

{header(prefix, None, lang, alt, strip=False)}

  <main class="blog-main quiz-main" id="main">
    <section class="blog-head quiz-section">
      <div class="narrow-container">
        <div class="quiz-stage js-quiz" aria-live="polite">
          <div class="quiz-screen quiz-intro is-active">
            <p class="kicker quiz-kicker">{esc(Q['kicker'])}</p>
            <h1 class="blog-title quiz-title">{esc(Q['title'])}</h1>
            <p class="blog-intro quiz-intro-text">{esc(Q['intro'])}</p>
            <div class="quiz-start-row">
              <button type="button" class="button quiz-start js-quiz-start">{esc(Q['start'])}</button>
              <p class="quiz-note">{esc(Q['note'])}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

{footer(prefix, lang, alt, guide=False)}

  <script type="application/json" id="quiz-data">{_quiz.client_json(lang)}</script>
  <script src="{prefix}assets/vendor/lenis.min.js?v=1.3.26"></script>
  <script src="{prefix}main.js?v={VERSION}"></script>
  <script src="{prefix}assets/quiz-logic.js?v={VERSION}"></script>
  <script src="{prefix}assets/quiz.js?v={VERSION}"></script>
</body>
</html>
"""
        tag = '<html lang="%s">' % u["html_lang"]
        page = page.replace(tag, tag[:-1] + ' class="no-strip">', 1)
        d = os.path.join(ROOT, "diagnostico") if lang == "pt" else os.path.join(ROOT, "en", "diagnosis")
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(page)
    _quiz.run()


# --------------------------------------------------------------------------
# 404 (served for any missing URL, so every path is root-absolute)
# --------------------------------------------------------------------------
def build_404():
    prefix = "/"
    links = [
        ("/", "Voltar à página inicial", ""),
        ("/blog/", "Ler o blog", ""),
        ("/diagnostico/", "Fazer o diagnóstico do meu site", ""),
        (CALENDLY, "Marcar uma chamada", ' target="_blank" rel="noopener"'),
    ]
    rows = "\n".join(
        f'          <li><a href="{href}"{attrs}><span class="nf-label">{esc(label)}</span><span class="nf-arrow" aria-hidden="true">→</span></a></li>'
        for href, label, attrs in links)
    page = f"""{head("Página não encontrada | Mariana Marcelino", "A página que procura não existe ou mudou de sítio.", f"{SITE}/404", f"{SITE}/assets/og-image.png", prefix, "website", []).replace('<meta name="robots" content="index,follow,max-image-preview:large">', '<meta name="robots" content="noindex">')}
<body>

{header(prefix, current=None)}

  <main class="blog-main nf-main" id="main">
    <section class="blog-head nf-head">
      <p class="kicker blog-kicker">Página não encontrada</p>
      <div class="narrow-container">
        <h1 class="blog-title">Ups, esta página não existe!</h1>
        <p class="blog-intro">Um link partido é um dos 8 sinais de que um site está a afastar clientes. Este, felizmente, tem saída.</p>
        <ol class="nf-links">
{rows}
        </ol>
        <p class="nf-en" lang="en">Page not found. <a href="/en/">Go to the English homepage →</a></p>
      </div>
    </section>
  </main>

  <script src="{prefix}assets/vendor/lenis.min.js?v=1.3.26"></script>
  <script src="{prefix}main.js?v={VERSION}"></script>
</body>
</html>
"""
    open(os.path.join(ROOT, "404.html"), "w", encoding="utf-8").write(page)


# --------------------------------------------------------------------------
# Sitemap, robots, llms.txt
# --------------------------------------------------------------------------
def build_seo_files():
    latest = max(p["date"] for p in POSTS)
    urls = [(f"{SITE}/", latest), (f"{SITE}/en/", latest), (f"{SITE}/blog/", latest)]
    urls += [(f"{SITE}/blog/{p['slug']}/", p["date"]) for p in POSTS]
    urls += [(f"{SITE}/en/blog/", latest)] + [(f"{SITE}/en/blog/{p['slug']}/", p["date"]) for p in posts_for("en")]
    from _legal_en import LEGAL_EN
    urls += [(f"{SITE}/{l['slug']}/", LEGAL_UPDATED) for l in LEGAL]
    urls += [(f"{SITE}/en/{l['slug']}/", LEGAL_UPDATED) for l in LEGAL_EN]
    urls += [(f"{SITE}/diagnostico/", latest), (f"{SITE}/en/diagnosis/", latest)]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sm += [f"  <url><loc>{u}</loc><lastmod>{d}</lastmod></url>" for u, d in urls]
    sm.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(sm) + "\n")

    open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8").write(
        "User-agent: *\nAllow: /\n\n"
        f"Sitemap: {SITE}/sitemap.xml\n")

    posts = "\n".join(f"- [{p['title']}]({SITE}/blog/{p['slug']}/): {p['description']}" for p in POSTS)
    posts_en = "\n".join(f"- [{p['title']}]({SITE}/en/blog/{p['slug']}/): {p['description']}" for p in posts_for("en"))
    llms = f"""# Mariana Marcelino

> Web designer e developer em Portugal. Redesenha e reconstrói sites de pequenos negócios para que tenham uma imagem moderna e credível, sejam encontrados no Google e em ferramentas de IA (ChatGPT, Perplexity) e transformem visitas em contactos. Trabalha remotamente com negócios de todo o país e do estrangeiro, em português e inglês.

> Web designer and developer based in Portugal. Redesigns and rebuilds small-business websites so they look modern and credible, get found on Google and AI tools, and turn visitors into enquiries. Works remotely with clients in Portugal and abroad, in Portuguese and English.

Áreas: design, automação e IA aplicados a sites. Trabalha diretamente com o cliente, sem estrutura de agência. Formação em marketing, em desenvolvimento de software desde 2018 e com negócio próprio.

## Planos

- Nova Imagem (750€, para sites até 4 páginas; mais páginas sob consulta): novo design mantendo a estrutura e os conteúdos atuais, melhor hierarquia visual, otimização para mobile e publicação.
- Motor de Contactos (1 800€ de valor base, o mais popular): novo design e estrutura à medida, integração dos conteúdos do cliente, otimização para Google, ChatGPT e outras ferramentas de IA, percurso e chamadas à ação que convertem visitas, formulários e questionários que captam contactos, follow-ups automáticos a cada novo pedido, integração com WhatsApp, painel de métricas, otimização para mobile e publicação. Extras à medida, pagos à parte: chatbot com IA treinado no negócio, sistemas de marcação automática, blog editável para ser encontrado no Google e IA, páginas e idiomas adicionais, pagamentos online e manutenção regular.

Além dos planos (não é um plano): para quem ainda não tem a certeza e quer ver o potencial antes de investir, o Redesign da Homepage gratuito — redesign da homepage e relatório personalizado com pontos a otimizar, enviado por email.

Antes de começar, o cliente recebe sempre uma proposta escrita com âmbito, prazo e valor fechado.

## Soluções

- Design e estrutura à sua medida
- Mais pessoas a encontrar o seu negócio (Google, ChatGPT e outras ferramentas de IA)
- Mais visitantes a contactar
- Menos trabalho manual (automação de tarefas repetitivas)
- Marcações imediatas
- Resultados que pode acompanhar (métricas)

## Como funciona

- Prazos: o redesign gratuito da homepage fica pronto em 2 dias; o Nova Imagem demora cerca de 1 semana; no Motor de Contactos o prazo depende da complexidade e fica definido na proposta.
- Processo: conversa inicial de 30 minutos, proposta escrita, design aprovado pelo cliente (com duas rondas de revisões), construção, testes e publicação, entrega dos acessos com uma pequena formação.
- Depois da publicação: o site é do cliente, que o pode gerir de forma autónoma; a manutenção é opcional e definida caso a caso.
- Onde trabalha: remotamente, com negócios de todo o país e do estrangeiro, por videochamada, email e mensagens.

## Recursos gratuitos

- [Diagnóstico gratuito do site]({SITE}/diagnostico/): 9 perguntas, resultado imediato com pontuação, pontos fracos e o plano recomendado. Relatório completo por email, com o guia "Oito sinais de que o seu site está a afastar clientes". [In English]({SITE}/en/diagnosis/)

## Páginas principais

- [Página inicial]({SITE}/): o problema, soluções, sobre, planos, perguntas frequentes, testemunhos e contacto.
- [Homepage in English]({SITE}/en/)
- [Blog]({SITE}/blog/)
- [Blog in English]({SITE}/en/blog/)
- [Marcar chamada]({CALENDLY}): chamada gratuita de 30 minutos (também abre diretamente no site, em qualquer botão "Marcar chamada").
- [Política de Privacidade]({SITE}/politica-de-privacidade/)

## Artigos

{posts}

## Articles (English)

{posts_en}

## Contacto

- Email: info@mariana-marcelino.com
- LinkedIn: {LINKEDIN}
"""
    open(os.path.join(ROOT, "llms.txt"), "w", encoding="utf-8").write(llms)

def stamp_homepages():
    """The homepages are written by hand, so give their CSS and JS links this build's
    version too. Otherwise browsers keep serving cached copies until a refresh."""
    pat = re.compile(r'((?:styles\.css|main\.js|assets/hero-reel\.(?:css|js))\?v=)\d+')
    for f in ("index.html", os.path.join("en", "index.html")):
        path = os.path.join(ROOT, f)
        page = open(path, encoding="utf-8").read()
        open(path, "w", encoding="utf-8").write(pat.sub(lambda m: m.group(1) + VERSION, page))


if __name__ == "__main__":
    stamp_homepages()
    for lang in ("pt", "en"):
        build_index(lang)
        for i, p in enumerate(posts_for(lang)):
            build_post(i, p, lang)
    build_legal()
    build_quiz()
    build_404()
    build_seo_files()
    import _schema_home
    _schema_home.run()
    import _knowledge
    _knowledge.run()
    print("built", len(POSTS), "posts")
