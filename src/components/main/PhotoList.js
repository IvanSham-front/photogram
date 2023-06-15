import Post from "../Post/Post";
import React, { useCallback, useEffect, useState, useRef } from "react";
import unsplashUser from "../../unsplash/unsplash.js";
import { toJson } from "unsplash-js";


const splitArray = (array, n) => {
	const result = []
	for (let i = 0; i < n; i++) {
		result.push([]);
		for (let j = i; j < array.length; j += n) {
			result[i].push(array[j])
		}
	}
	return result
}


function PhotoList(props) {
	const [page, setPage] = useState(1);
	const [images, setImages] = useState([]);
	const [load, setLoad] = useState(false);
	const [error, setError] = useState(false)

	const loader = useRef(null);

	const handleObserver = useCallback((entries) => {
		const target = entries[0];
		if (target.isIntersecting) {
			setPage((prev) => prev + 1);
		}
	}, []);

	useEffect(() => {
		const option = {
			root: null,
			rootMargin: '20px',
			threshold: 0.5
		};
		const observer = new IntersectionObserver(handleObserver, option);
		if (loader.current) {
			observer.observe(loader.current);
		}
	}, [handleObserver, load])

	useEffect(() => {
		try {
			unsplashUser.photos.listPhotos(page, 15, 'latest')
				.then(toJson)
				.then(data => {
					setImages((prevState) => {
						return [...new Set([...prevState, ...data])]
					});
					setLoad(true)
				})
		} catch (error) {
			console.log('error ' + error);
			setError(true)
		}
	}, [page])


	const onLikeOrDislikePhoto = (likedByPhoto, id) => {
		console.log(likedByPhoto)
		if (!likedByPhoto) {
			unsplashUser.photos.likePhoto(id)
				.then(toJson)
				.then(json => console.log(json))
		} else {
			unsplashUser.photos.unlikePhoto(id)
		}
		for (let image of images) {
			if (image.id === id) {
				image.liked_by_user = !image.liked_by_user;
				setImages(prevState => {
					return [...prevState]
				})
			}
		}
	}
	if (load) {
		return (
			<main className="fixed-container">
				<section className="content-block content-block__inner">
					{
						splitArray(images, props.columns).map((imagesChunk, index) => {
							return (
								<ul className="postes" key={index}>
									{imagesChunk.map((image) => {
										return (
											<li
												key={image.id}
												className="postes__item"
											>
												<Post
													userLink={image.user.links.html}
													srcPost={image.urls.small}
													altPost={image.alt_description}
													userName={image.user.name}
													likes={image.likes}
													userPhoto={image.user.profile_image.small}
													downloadLink={image.links.download_location}
													liked_by_user={image.liked_by_user}
													auth={props.auth}
													onClick={() => props.auth ? onLikeOrDislikePhoto(image.liked_by_user, image.id) : window.onLogin()}
													id={image.id}
												/>
											</li>
										)
									})}
								</ul>)
						}
						)
					}
				</section>
				<div className="loader" ref={loader}></div>
			</main>
		)
	} else if (error && !load) {
		return (
			<div className="error">
				<p className="error__text">An error has occurred. Please reload the page</p>
			</div>
		)
	} else {
		return (
			<div className="loading">
				<svg className="spinner" viewBox="0 0 50 50">
					<circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
				</svg>
			</div>
		)
	}
}

export default PhotoList;