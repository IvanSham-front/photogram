import React, { useState, useEffect } from "react";
import Icons from "../../img/icons/Icons";
import unsplashUser from "../../unsplash/unsplash";
import { toJson } from "unsplash-js";
import { Link } from "react-router-dom";

export default function PhotoDetail(props) {
	const [image, setImage] = useState({});
	const [load, setLoader] = useState(false);
	const [error, setError] = useState(false)
	const anchor = 1

	const auth = props.auth

	const onLikeOrDislikePhoto = (likedByPhoto, id) => {
		console.log(likedByPhoto)
		if (!likedByPhoto) {
			unsplashUser.photos.likePhoto(id)
			setImage(prevState => ({ ...prevState, liked_by_user: !image.liked_by_user, likes: image.likes + 1 }))
		} else {
			unsplashUser.photos.unlikePhoto(id)
			setImage(prevState => ({ ...prevState, liked_by_user: !image.liked_by_user, likes: image.likes - 1 }))
		}
	}

	useEffect(() => {
		const idPhoto = window.location.pathname.split('id=')[1]
		try {
			unsplashUser.photos.getPhoto(idPhoto)
				.then(toJson)
				.then(data => {
					setImage(data)
					setLoader(true)
				})
		} catch (err) {
			console.log('error' + err)
			setError(true)
		}
	}, [anchor])


	if (load) {
		const options = { day: 'numeric', month: 'numeric', year: 'numeric' }
		const date = new Date(image.created_at).toLocaleString('ru', options);
		console.log(date)
		return (
			<div className="fixed-container photo-block photo-block__inner">
				<div className="photo-detail">
					{/* <div className="photo-detail__top"> */}
					<figure className="user-info photo-detail__user-info">
						<a
							className="user-info__link"
							href={image.user.links.html}
						>
							<img
								alt="avatar"
								src={image.user.profile_image.medium}
								className="user-info__portrait"
							>
							</img>

							<figcaption className="user-info__text user-info__text_white">{image.user.name}</figcaption>
						</a>
					</figure>

					<Link to="/" className="btn-close">
						<Icons
							name='closeIcon'
							className="btn-close__icon"
						/>
					</Link>
					{/* </div> */}

					<div className="photo-detail__image">
						<img
							alt={image.alt_description}
							src={image.urls.regular}
							className="photo-detail__img"
						>
						</img>

						<div className="photo-detail__props">
							<div className="photo-detail__likes likes">
								<button
									onClick={() => auth ? onLikeOrDislikePhoto(image.liked_by_user, image.id) : window.onLogin()}
									className="btn likes__btn-like">
									<Icons
										name={image.liked_by_user ? 'blackHeart' : 'likeIcon'}
										color={image.liked_by_user ? '#d3104b' : '#8993ad'}
										size='25'
										className="btn__icon-like"
									/>
								</button>

								<span className="likes-info__sum">{image.likes}</span>
							</div>

							<time className="photo-detail__date">{date}</time>
						</div>
					</div>
				</div>
			</div>
		)
	} else if (error && !load) {
		return (
			<div className="error">
				<p className="error__text">An error has occurred. Please reload the page</p>
			</div>
		)
	} else if (!load) {
		return (
			<div className="loading">
				<svg className="spinner" viewBox="0 0 50 50">
					<circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
				</svg>
			</div>
		)
	}
}