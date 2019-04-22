'use strict';

// component functions
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
        source = 'imgur (album)'
      } else {
        source = 'imgur'
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
      source = 'imgur'
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

    if(item.data.url.includes('gfycat') === true){
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

module.exports = {standardizeImgurData, standardizeRedditData, standardizeNewsAPIData};