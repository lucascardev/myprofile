import React, { useEffect, useState } from 'react'
import Pacman3D from './components/Pacman3D';

import {
	FaGithub,
	FaInstagram,
	FaLinkedin,
	FaTooth,
	FaHtml5,
	FaCss3,
	FaReact,
	FaNodeJs,
	FaDocker,
	FaJsSquare,
	FaGit,
	FaEye,
	FaHandPointUp,
} from 'react-icons/fa'

import { SiTypescript, SiTrailforks } from 'react-icons/si'

import {
	Container,
	Header,
	Avatar,
	Username,
	Main,
	Contact,
	Footer,
	PageHolder,
	Gitinfo,
	Info,
	Repo,
	Count,
	Repos,
} from './style/global.style'

import API from './services/api'


function App() {
	const [avatarimg, setAvatarimg] = useState('')
	const [username, setUsername] = useState('')
	const [repos, setRepos] = useState([])
	const [language, setLanguage] = useState('en')

	useEffect(() => {
		async function getmyprofile() {
			const response = await API.get('users/lucascardev')
			const repos_response = await API.get('users/lucascardev/repos')
			setRepos(repos_response.data)
			setAvatarimg(response.data.avatar_url)
			setUsername(response.data.login)
		}
		getmyprofile()
	}, [])

	useEffect(() => {
		const detectLanguage = () => {
			const userLanguage = navigator.language || navigator.userLanguage
			if (userLanguage.startsWith('pt')) {
				setLanguage('pt')
			} else {
				setLanguage('en')
			}
		}

		detectLanguage()

		window.addEventListener('languagechange', detectLanguage)

		return () => {
			window.removeEventListener('languagechange', detectLanguage)
		}
	}, [])

	return (
		<Container>
			<Header>
				<Gitinfo>
					<Avatar src={avatarimg} />
					<div
						style={{
							color: 'whitesmoke',
							display: 'flex',
							justifyItems: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Username>
							<a
								href='https://github.com/lucascardev'
								alt='Github profile'
								target='_blank'
								rel='noreferrer'
							>
								@{username}
							</a>
						</Username>
						<p className='github-hint'>
							<FaHandPointUp /> Veja meu github acima{' '}
							<FaHandPointUp />
						</p>
					</div>
				</Gitinfo>
				<Contact>
					<p>
						<b>Phonenumber:</b> &nbsp;{' '}
						<a href='tel:+5571992931330'>+55(71)99293-1330</a>
					</p>
					<p>
						<b>Email: </b> &nbsp;{' '}
						<a href='mailto:lucasmatheussc97@gmail.com'>
							lucasmatheussc97@gmail.com
						</a>
					</p>
				</Contact>

				<div className='techs'>
					<SiTypescript />
					<FaCss3 />
					<FaDocker />
					<FaHtml5 />
					<FaReact />
					<FaNodeJs />
					<FaJsSquare />
					<FaGit />
				</div>
			</Header>
			<PageHolder>
				{language === 'en' && (
					<Main>
						<h1>Hello there. I'm lucascardev.</h1>
						<p>
							I'm a programming enthusiast dedicated to following best practices for web
							development. With a passion for creating innovative solutions, I maintain
							several projects on my GitHub. I have **over 6 years of programming experience**
							and hold a degree from **Estácio University**. One of my standout projects
							is a dental appointment scheduling application. I’m constantly seeking
							improvement, committed to continuous learning, and actively look for opportunities
							to broaden my horizons and deepen my understanding of programming complexities.
							With an unwavering commitment to personal and professional growth, I’m determined
							to reach new levels of excellence.
						</p>
						<hr />
						<p className='social-media-text'> Keep contact with me on my social media. </p>
						<div className='linkholder'>
							<a href='https://www.instagram.com/lucas_mtheus/'>
								<FaInstagram />
							</a>
							<a href='https://github.com/lucascardev'>
								<FaGithub />
							</a>

							<a href='https://www.linkedin.com/in/lucascardev'>
								<FaLinkedin />
							</a>
						</div>

						<p className='dentistry-text'> Im also a dentistry</p>
						<div
							className='linkholder'
							style={{ marginBottom: 30 }}
						>
							<a href='https://www.instagram.com/dr.lucasmscardoso/'>
								<FaTooth />
							</a>
						</div>
						<Repos>
							{repos.map((repo) => (
								<Repo key={repo.id}> {/* Adicionado key aqui */}
									<h3>Repo - {repo.description || repo.name}</h3> {/* Adicionado fallback para description */}
									<p>
										<a href={repo.html_url} target='_blank' rel='noreferrer'>
											{repo.full_name}
										</a>
									</p>
									<p>{repo.language}</p>
									<Info>
										<Count>
											<SiTrailforks />
											{repo.forks_count} {/* Usar forks_count */}
										</Count>{' '}
										<Count>
											<FaEye />
											{repo.watchers_count} {/* Usar watchers_count */}
										</Count>
									</Info>
								</Repo>
							))}
						</Repos>
						  {/* AQUI VOCÊ ADICIONA O COMPONENTE 3D */}
                        <h2>3D Pac-Man Demo</h2>
                        <p>A small demonstration using Three.js:</p>
                        <Pacman3D /> {/* O componente 3D */}
                        <hr />
                        {/* ... Restante do conteúdo em inglês ... */}
					</Main>
				)}
				{language === 'pt' && (
					<Main>
						<h1>Olá! Eu sou o lucascardev.</h1>
						<p>
							Sou um entusiasta da programação que adora seguir as melhores práticas para o
							desenvolvimento web. Tenho uma paixão por criar soluções inovadoras e mantenho
							vários projetos no meu GitHub. Possuo **mais de 6 anos de experiência em programação**
							e sou formado pela **Faculdade Estácio**. Um dos meus projetos de destaque
							é um aplicativo de agendamento odontológico. Estou sempre em busca de aprimoramento
							e continuo minha jornada de aprendizado. Busco constantemente oportunidades
							para expandir meus horizontes e aprofundar minha compreensão das complexidades
							da programação. Com um compromisso inabalável com o crescimento pessoal e
							profissional, estou determinado a alcançar novos patamares de excelência.
						</p>
						<hr />
						<p className='social-media-text'> Me siga nas redes sociais </p>
						<div className='linkholder'>
							<a href='https://www.instagram.com/lightup.marketingdigital/'>
								<FaInstagram />
							</a>
							<a href='https://github.com/lucascardev'>
								<FaGithub />
							</a>

							<a href='https://www.linkedin.com/in/lucascardev'>
								<FaLinkedin />
							</a>
						</div>
						<hr />
						{/* <p className='dentistry-text'> Também sou dentista</p>
						<div
							className='linkholder'
							style={{ marginBottom: 30 }}
						>
							<a href='https://www.instagram.com/dr.lucasmscardoso/'>
								<FaTooth />
							</a>
						</div> */}
						<Repos>
							{repos.map((repo) => (
								<Repo key={repo.id}> {/* Adicionado key aqui */}
									<h3>Repo - {repo.description || repo.name}</h3> {/* Adicionado fallback para description */}
									<p>
										<a href={repo.html_url} target='_blank' rel='noreferrer'>
											{repo.full_name}
										</a>
									</p>
									<p>{repo.language}</p>
									<Info>
										<Count>
											<SiTrailforks />
											{repo.forks_count} {/* Usar forks_count */}
										</Count>{' '}
										<Count>
											<FaEye />
											{repo.watchers_count} {/* Usar watchers_count */}
										</Count>
									</Info>
								</Repo>
							))}
						</Repos>
						 {/* AQUI VOCÊ ADICIONA O COMPONENTE 3D */}
                        <h2>Demonstração 3D Pac-Man</h2>
                        <p>Uma pequena demonstração utilizando Three.js:</p>
                        <Pacman3D /> {/* O componente 3D */}
                        <hr />
                        {/* ... Restante do conteúdo em português ... */}
					</Main>
				)}
			</PageHolder>

			<Footer>
				<p>
					This page was build using the{' '}
					<a href='https://pages.github.com/'>
						<b>GitHub Pages</b>
					</a>{' '}
					an excelent frontend server.
				</p>
			</Footer>
		</Container>
	)
}

export default App