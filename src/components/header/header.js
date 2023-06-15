export default function Header(props) {
	return (
		<header className="header">
			<div className='fixed-container'>
				<div className={props.auth ? 'header__inner header__inner_auth' : 'header__inner'}>
					{
						props.auth &&
						<a className='header__left current-user'
							href={props.currentUserLink}
						>
							<img
								alt='user'
								className='current-user__logo'
								src={props.currentUserPhoto}
							></img>

							<figcaption className='current-user__name'>
								{props.currentUserName}
							</figcaption>
						</a>
					}

					<figure className='header__logo-block logo'>
						<img
							className="header__logo"
							alt="logo"
							src={props.logo}
						></img>
						<figcaption>
							<h1 className="header__title">PhotoGram</h1>
						</figcaption>
					</figure>

					<div className='header__right'>

						<button
							className="header__button"
							type="button"
							onClick={props.onClick}
						>{props.auth ? 'Logout' : 'Login'}
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}