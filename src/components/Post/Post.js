import { Link } from "react-router-dom";
import Icons from '../../img/icons/Icons';


export default function Post(props) {
    const auth = props.auth
    return(
        <div className="post post__inner">
            <div className='post__hidden'>
                <div className='post__info'>
                    <figure className="post__user user-info">
                        <a
                        className="user-info__inner-link"
                        href={props.userLink} 
                        >
                            <img
                                alt={props.userName}
                                src={props.userPhoto}
                                className="user-info__portrait"
                            >
                            </img>

                            <figcaption className="user-info__text">{props.userName}</figcaption>
                        </a>

                    </figure>
                    <div className="post__buttons likes likes_end">
                        <button className="btn likes__btn-like"
                            disabled={auth ? false : true}
                            onClick={props.onClick}
                        >
                            <Icons
                                name={props.liked_by_user ? 'blackHeart' : 'likeIcon'}
                                color={props.liked_by_user ? '#d3104b' : '#e9e9e9'}
                                size='25'
                                className="btn__icon-like"
                            />
                            
                        </button>

                    </div>
                </div>

                <Link to={`photo/id=${props.id}`} className="blackout"></Link>
            </div>


            <img
                className="post__img"
                alt={props.altPost}
                src={props.srcPost}
            >
            </img>

        </div>
    )
}