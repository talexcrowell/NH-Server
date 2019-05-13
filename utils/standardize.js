'use strict';
//rex functions
function standardizeMovieDBTVMini(data){
  return data.map(show => {
    let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${show.data.poster_path}`;
    let genre0 = (show.data.genres[0] ? show.data.genres[0].name : null);
    let genre1 = (show.data.genres[1] ? show.data.genres[1].name : null);
    let genre2 = (show.data.genres[2] ? show.data.genres[2].name : null);
    return{
      moviedbid: show.data.id,
      title: show.data.name,
      img, 
      type: 'tv',
      country: (show.data.origin_country.length > 0 ? show.data.origin_country[0] : 'N/A'),
      genre0,
      genre1,
      genre2
    };
  });
}

function standardizeMovieDBTVData(data){
  return data.results.map(item => {
    let genres = [];
    let genreNumber =[
      {
        'id': 28,
        'name': 'Action'
      },
      {
        'id': 12,
        'name': 'Adventure'
      },
      {
        'id': 16,
        'name': 'Animation'
      },
      {
        'id': 35,
        'name': 'Comedy'
      },
      {
        'id': 80,
        'name': 'Crime'
      },
      {
        'id': 99,
        'name': 'Documentary'
      },
      {
        'id': 18,
        'name': 'Drama'
      },
      {
        'id': 10751,
        'name': 'Family'
      },
      {
        'id': 14,
        'name': 'Fantasy'
      },
      {
        'id': 36,
        'name': 'History'
      },
      {
        'id': 27,
        'name': 'Horror'
      },
      {
        'id': 10402,
        'name': 'Music'
      },
      {
        'id': 9648,
        'name': 'Mystery'
      },
      {
        'id': 10749,
        'name': 'Romance'
      },
      {
        'id': 878,
        'name': 'Science Fiction'
      },
      {
        'id': 10770,
        'name': 'TV Movie'
      },
      {
        'id': 53,
        'name': 'Thriller'
      },
      {
        'id': 10752,
        'name': 'War'
      },
      {
        'id': 37,
        'name': 'Western'
      }
    ];

    if(item.genres){
      for(let i=0; i < item.genres.length; i++){
        let find = genreNumber.filter(genre => item.genres[i].id === genre.id)[0];
        genres.push(find.name);
      }
    }
    let url = `https://www.themoviedb.org/tv/${item.id}`;
    let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}`;
    return {
      title: item.name,
      movieDbId: item.id,
      movieDbrating: item.vote_average,
      url,
      language: item.original_language,
      released: item.first_air_date,
      img, 
      overview: item.overview,
      genres: item.genres,
      type: 'TV'
    };
  });
}

function standardizeMovieDBTVDetailsData(data){
  return data.map(item => {
    let genres = [];
    let genreNumber =[
      {
        'id': 28,
        'name': 'Action'
      },
      {
        'id': 12,
        'name': 'Adventure'
      },
      {
        'id': 16,
        'name': 'Animation'
      },
      {
        'id': 35,
        'name': 'Comedy'
      },
      {
        'id': 80,
        'name': 'Crime'
      },
      {
        'id': 99,
        'name': 'Documentary'
      },
      {
        'id': 18,
        'name': 'Drama'
      },
      {
        'id': 10751,
        'name': 'Family'
      },
      {
        'id': 14,
        'name': 'Fantasy'
      },
      {
        'id': 36,
        'name': 'History'
      },
      {
        'id': 27,
        'name': 'Horror'
      },
      {
        'id': 10402,
        'name': 'Music'
      },
      {
        'id': 9648,
        'name': 'Mystery'
      },
      {
        'id': 10749,
        'name': 'Romance'
      },
      {
        'id': 878,
        'name': 'Science Fiction'
      },
      {
        'id': 10770,
        'name': 'TV Movie'
      },
      {
        'id': 53,
        'name': 'Thriller'
      },
      {
        'id': 10752,
        'name': 'War'
      },
      {
        'id': 37,
        'name': 'Western'
      }
    ];

    let url = `https://www.themoviedb.org/tv/${item.id}`;
    let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}`;
    return {
      title: item.name,
      movieDbId: item.id,
      movieDbrating: item.vote_average,
      url,
      language: item.original_language,
      released: item.first_air_date,
      img, 
      overview: item.overview,
      lastEpisode: item.last_episode_to_air,
      nextEpisode: item.next_episode_to_air,
      totalEpisodes: item.number_of_episodes,
      totalSeasons: item.number_of_seasons,
      networks: item.networks,
      genres: item.genres,
      type: 'TV'
    };
  });
}

function standardizeMovieDBTVShowDetailsData(data){
  let video =  data.videos.results.filter(vid => vid.type === 'Opening Credits' || vid.type === 'Trailer');
  console.log(video);
  let url = `https://www.themoviedb.org/tv/${data.id}`;
  let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.poster_path}`;
  return {
    title: data.name,
    altTitle: data.original_name,
    movieDbId: data.id,
    movieDbrating: data.vote_average,
    url,
    language: data.original_language,
    country: data.origin_country,
    runtime: data.episode_run_time[0],
    released: data.first_air_date,
    status: data.status,
    showType: data.type,
    img,
    videos: video[0], 
    overview: data.overview,
    seasons: data.seasons,
    lastEpisode: data.last_episode_to_air,
    nextEpisode: data.next_episode_to_air,
    totalEpisodes: data.number_of_episodes,
    totalSeasons: data.number_of_seasons,
    networks: data.networks,
    genres: data.genres,
    type: 'tv'
  };
}

function standardizeMovieDBMovieData(data){
  return data.results.map(item => {
    let genres = [];
    let genreNumber =[
      {
        'id': 28,
        'name': 'Action'
      },
      {
        'id': 12,
        'name': 'Adventure'
      },
      {
        'id': 16,
        'name': 'Animation'
      },
      {
        'id': 35,
        'name': 'Comedy'
      },
      {
        'id': 80,
        'name': 'Crime'
      },
      {
        'id': 99,
        'name': 'Documentary'
      },
      {
        'id': 18,
        'name': 'Drama'
      },
      {
        'id': 10751,
        'name': 'Family'
      },
      {
        'id': 14,
        'name': 'Fantasy'
      },
      {
        'id': 36,
        'name': 'History'
      },
      {
        'id': 27,
        'name': 'Horror'
      },
      {
        'id': 10402,
        'name': 'Music'
      },
      {
        'id': 9648,
        'name': 'Mystery'
      },
      {
        'id': 10749,
        'name': 'Romance'
      },
      {
        'id': 878,
        'name': 'Science Fiction'
      },
      {
        'id': 10770,
        'name': 'TV Movie'
      },
      {
        'id': 53,
        'name': 'Thriller'
      },
      {
        'id': 10752,
        'name': 'War'
      },
      {
        'id': 37,
        'name': 'Western'
      }
    ];

    if(item.genre_ids){
      for(let i=0; i < item.genre_ids.length; i++){
        let itemId = item.genre_ids[i];
        let match = genreNumber.filter(genre => genre.id === itemId);
        genres.push(match[0].name);
      }
    }
    let url = `https://www.themoviedb.org/tv/${item.id}`;
    let img = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}`;
    return {
      title: item.title,
      movieDbId: item.id,
      movieDbrating: item.vote_average,
      url,
      language: item.original_language,
      released: item.release_date,
      img, 
      overview: item.overview,
      genres,
      type: 'TV'
    };
  });
}

// fetch functions
function standardizeImgurData(results){
  return results.data.map(item => {
    // scope placeholders
    let img;
    let tag;
    let type;
    let source;

    //select first image in gallery) for preview and retrieve appropriate link
    if(item.is_album === true){
      if(item.images.length > 1){
        source = 'imgur (album)';
      } else {
        source = 'imgur';
      }
      let itemMedia = item.images[0];

      if(itemMedia.type === 'video/mp4'){
        img = itemMedia.mp4;
        type = 'video/mp4';
      }
      else if(itemMedia.type ==='image/gif'){
        img = itemMedia.mp4;
        type = 'video/mp4';
      }
      else{
        img = itemMedia.link;
        type = itemMedia.type;
      }
    }
    //select image if not in a gallery
    else{
      img = item.link;
      type = item.type; 
      source = 'imgur';
    }

    //select first tag in tags array for category
    if(item.tags.length > 0){
      let input = item.tags[0];
      tag = input.name;
    }
    else{
      tag='';
    }

    //community item structured response
    return {
      id: item.id,
      url: item.link,
      title: item.title,
      img, 
      publishedAt: item.datetime,
      category: tag,
      type: type,
      source,
      section: 'community'
    };
  });
}

function standardizeRedditData(results){
  return results.children.map(item => {
    //create placeholders
    let url = 'https://www.reddit.com'+item.data.permalink;
    let img;
    let type;

    if(item.data.domain.includes('gfycat') === true && item.data.secure_media !== null){
      img = item.data.secure_media.oembed.thumbnail_url;
      type = 'image/gif'; 
    }
    else if(item.data.url.endsWith('.gifv')){
      let convert = item.data.url.replace('.gifv', '.mp4');
      img = convert;
      type = 'video/mp4';
    }
    else if(item.data.is_video === true){
      img = item.data.media.reddit_video.fallback_url;
      type = 'video/mp4';
    }
    else if(item.data.url.endsWith('.jpg') === false && item.data.url.endsWith('.gif') === false && item.data.url.endsWith('.png') === false){
      img = '';
      type = 'article';
    }
    else{
      img = item.data.url;
      type = 'image/jpg';
    }

    //community item structured response
    return {
      id: item.data.id,
      url,
      title: item.data.title,
      img: img, 
      publishedAt: item.data.created_utc,
      category: item.data.subreddit_name_prefixed,
      type,
      source: 'reddit',
      section: 'community'
    };
  });
}

function standardizeGiphyData(results){
  return results.data.map(item => {
    return {
      id: item.id,
      url: item.url,
      title: item.title,
      img: item.images.original.url, 
      publishedAt: item.trending_datetime.slice(11, item.trending_datetime.length),
      category: '',
      type: 'image/'+item.type,
      source: 'giphy',
      section: 'community'
    };
  });
}

function standardizeNewsAPIData(results, category){
  return results.articles.map(item => {
    // placeholders
    let id;
    let title;
    let date;
    let time;
    let summary;

    id = `news-${Math.floor(Math.random()*90000)+1}`;
      
    //scrub title of trailing source string
    let titleRegex = / - .*[^']/g;
    title= item.title.replace(titleRegex, '');

    let localDate= new Date(item.publishedAt).toLocaleString();

    //retrieve the "time" portion of publishedAt information
    time = localDate.replace(',', '').slice(9);

    //retrieve the "date" portion of publishedAt information
    date = localDate.replace(',', '').slice(0, 9);
    
    //retrieve the "summary" preview portion
    let summaryRegex =  /\[.*\]/g;
    if(item.description){
      summary = item.description.replace(summaryRegex, '');
    }
    //news item structured response
    return {
      id,
      title,
      date,
      time,
      url: item.url,
      img: item.urlToImage,
      source: item.source,
      category,
      summary,
      section: 'news'
    };
  }); 
}

module.exports = {standardizeImgurData, standardizeRedditData, standardizeGiphyData, standardizeNewsAPIData, standardizeMovieDBTVMini, standardizeMovieDBTVData, standardizeMovieDBTVDetailsData, standardizeMovieDBTVShowDetailsData, standardizeMovieDBMovieData};