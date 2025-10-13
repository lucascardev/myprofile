import styled from 'styled-components'

// Definição das cores e fontes para uso global
const colors = {
    primaryBackground: '#1a1a2e', // Darker background
    secondaryBackground: '#2c3e50', // Lighter dark for cards/sections
    primaryText: '#e0e0e0', // Light text
    accent: '#00bcd4', // Modern accent color (cyan/light blue)
    softGray: '#cccccc', // For subtle elements
};

const fontSizes = {
    h1: '2.5em',
    h2: '1.8em',
    h3: '1.4em',
    body: '1em',
    small: '0.8em',
};


export const Count = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center; /* Alinha ícone e texto */
	width: auto; /* Deixa o width dinâmico */
	font-size: ${fontSizes.small}; /* Tamanho menor para os números */
    color: ${colors.softGray}; /* Cor mais suave para os contadores */
    svg {
        margin-right: 5px;
        color: ${colors.accent};
    }
`

export const Repos = styled.div`
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20px; /* Espaçamento entre os cards */
	flex: 1;
	background-color: ${colors.primaryBackground}; /* Fundo escuro */
	color: ${colors.primaryText}; /* Texto branco */
	margin-top: 30px; /* Mais espaço */
	border-radius: 8px;
	padding: 20px; 
`

export const Repo = styled.div`
	display: flex;
	width: 30%; /* Mantido, mas com gap ele funciona melhor */
	min-width: 300px; /* Ajustado para telas menores, um pouco menos rígido */
	flex-direction: column;
	justify-content: space-between; /* Melhor para distribuir conteúdo */
	background-color: ${colors.secondaryBackground}; /* Fundo ligeiramente mais claro */
	color: ${colors.primaryText};
	margin-bottom: 0; /* Removido, já temos gap */
	border-radius: 8px; /* Bordas mais arredondadas */
	padding: 20px; /* Mais padding */
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Sombra suave */
	transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
	&:hover {
		transform: translateY(-5px); /* Pequena animação ao passar o mouse */
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
	}

	h3 {
		margin-top: 0;
		margin-bottom: 10px;
		color: ${colors.accent};
	}

	p {
		margin-top: 5px;
		margin-bottom: 5px;
		color: ${colors.softGray}; /* Texto mais suave para detalhes */
		a {
			color: ${colors.accent}; /* Link do repo */
            text-decoration: none;
			&:hover {
				color: ${colors.primaryText};
                text-decoration: underline;
			}
		}
	}
`

export const Info = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start; /* Alinhar à esquerda */
	margin-top: 15px; /* Espaço do conteúdo */
	border-top: 1px solid rgba(255, 255, 255, 0.1); /* Separador sutil */
	padding-top: 10px;

	${Count} { /* Estilizando o Count dentro do Info */
		margin-right: 20px; /* Espaço entre as contagens */
	}
`

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	background-color: ${colors.primaryBackground}; /* Fundo principal escuro */
	min-height: 100vh; /* Garante que o fundo cubra toda a altura */
    font-family: 'Arial', sans-serif; /* Uma fonte padrão mais profissional */
`

export const Header = styled.header`
	@media only screen and (max-width: 600px) {
		flex-direction: column;
		justify-content: center;
		flex: 1;
		padding: 8px 10px;
	}
	@media only screen and (max-width: 800px) {
		flex-wrap: wrap;
	}
	flex: 1;
	background-color: ${colors.secondaryBackground}; /* Fundo ligeiramente mais claro que o principal */
	display: flex;
	flex-direction: row;
	overflow: hidden;
	padding: 15px 20px; /* Mais padding */
	justify-content: space-between;
	align-items: center; /* Alinha itens verticalmente no centro */
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra sutil */

	.techs {
		@media only screen and (max-width: 600px) {
			font-size: 6vw;
			justify-content: center; /* Centralizar os ícones */
			margin-top: 15px; /* Mais espaço */
		}
		background: ${colors.primaryBackground}; /* Fundo escuro para os ícones */
		border-radius: 5px; /* Bordas mais arredondadas */
		display: flex;
		align-items: center;
		flex-direction: row;
		font-size: 2.8vw; /* Ajustado para um tamanho bom em desktop */
		color: ${colors.accent}; /* Cor de destaque para os ícones */
		padding: 10px 15px; /* Mais padding */
		margin-top: 0;
		
		svg {
			margin: 0 8px; /* Espaço entre os ícones */
			transition: transform 0.2s ease-in-out, color 0.2s ease-in-out; /* Animação ao passar o mouse */
			&:hover {
				transform: scale(1.1);
				color: ${colors.primaryText}; /* Ícone fica branco no hover */
			}
		}
	}

    .github-hint {
        color: ${colors.softGray}; /* Cor mais suave para a dica do GitHub */
        font-size: ${fontSizes.small};
        display: flex;
        align-items: center;
        margin-top: 5px;
        svg {
            margin: 0 5px;
            color: ${colors.accent};
        }
    }
`

export const Gitinfo = styled.div`
	@media only screen and (max-width: 600px) {
		flex-direction: row;
	}
	display: flex;
	align-self: center;
	flex-direction: row;
`

export const Avatar = styled.img`
	@media only screen and (max-width: 600px) {
		width: 60px;
		height: 60px;
	}
	width: 60px;
	align-self: center;
	height: 60px;
	border-radius: 50%;
	display: flex;
    border: 2px solid ${colors.accent}; /* Borda de destaque no avatar */
`

export const Contact = styled.div`
	@media only screen and (max-width: 600px) {
		font-size: ${fontSizes.body};
		padding: 8px;
		text-align: center;
        align-items: center; /* Centraliza os itens em mobile */
	}
	align-self: center;
	font-size: ${fontSizes.h3};
	display: flex;
	flex-direction: column;
	align-items: flex-end; /* Alinha os contatos à direita */


	p {
		color: ${colors.primaryText};
		display: flex;
		margin-top: 5px;
		align-items: center;
        b {
            color: ${colors.accent}; /* Negrito na cor de destaque */
        }
	}
	a {
		color: ${colors.primaryText};
		transition: color 0.2s, background 0.2s;
		display: flex;
		text-decoration: none;
		background: ${colors.accent};
		padding: 6px 10px;
		border-radius: 5px;
		margin-left: 10px;
		&:hover {
			background: ${colors.primaryBackground}; /* Fundo escuro no hover */
			color: ${colors.accent}; /* Texto de destaque no hover */
		}
	}
`

export const Username = styled.h1`
	@media only screen and (max-width: 600px) {
		align-self: center;
		font-size: ${fontSizes.h2};
		margin-top: 10px;
	}
	color: ${colors.accent};
	font-size: ${fontSizes.h1};
	align-self: center;
	padding: 0 20px;
	display: flex;
	a {
		color: ${colors.primaryText};
		text-decoration: none;
		transition: color 0.2s;
	}
	a:hover {
		color: ${colors.accent};
		text-decoration: underline;
	}
`

export const PageHolder = styled.div`
	@media only screen and (max-width: 600px) {
		align-self: center;
		flex: 1;
	}
	display: flex;
	padding: 16px;
`

export const Main = styled.div`
	@media only screen and (max-width: 600px) {
		padding: 15px;
	}
	display: flex;
	flex: 1;
	padding: 40px;
	background-color: ${colors.secondaryBackground};
	color: ${colors.primaryText};
	border-radius: 8px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	flex-direction: column;
	
	h1 {
		display: flex;
		margin-bottom: 20px;
		color: ${colors.accent};
		font-size: ${fontSizes.h1};
	}
	h3 {
		margin-top: 10px;
		margin-bottom: 10px;
		color: ${colors.accent};
	}
	hr {
		border: none;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		margin: 20px 0;
	}
	p {
		margin-top: 10px;
		text-align: left;
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
		line-height: 1.6;

		strong {
			color: ${colors.accent};
			font-weight: 600;
			margin: 5px 0;
		}

		a {
			color: ${colors.accent};
			transition: color 0.2s;
			text-decoration: none;
			&:hover {
				text-decoration: underline;
				color: ${colors.primaryText};
			}
		}

		&.social-media-text, &.dentistry-text {
            text-align: center; /* Centralizar esses parágrafos específicos */
            margin-top: 20px;
            margin-bottom: 10px;
            color: ${colors.softGray};
        }
	}
	.linkholder {
		background: ${colors.primaryBackground};
		border-radius: 8px;
		display: flex;
		justify-content: center;
		flex-direction: row;
		padding: 15px;
		margin-top: 20px;
		margin-bottom: 20px;

		a {
			@media only screen and (max-width: 600px) {
				font-size: 10vw;
			}
			display: flex;
			font-size: 3.5vw;
			color: ${colors.accent};
			transition: color 0.2s, transform 0.2s;
			padding: 10px 15px;
			align-items: center;
			&:hover {
				color: ${colors.primaryText};
				transform: translateY(-3px);
			}
		}
	}
`

export const Footer = styled.footer`
	background-color: ${colors.secondaryBackground};
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 20px;
	justify-content: center;
	text-align: center;
	margin-top: 30px;
	box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2);

	p {
		color: ${colors.softGray};
		font-size: ${fontSizes.small};
		a {
			color: ${colors.accent};
			text-decoration: none;
			&:hover {
				text-decoration: underline;
			}
		}
	}
`