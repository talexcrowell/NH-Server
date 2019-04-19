'use strict';

// component functions
function standardizeImgurData(results){
  return results.data.map(item => {
    // scope placeholders
    let img;
    let tag;

    //select first image in images array for preview
    if(item.images){
      let imgArr = item.images[0];

      // if(item.type === 'video/mp4'){
      //   img = imgArr.link;
      // }
      img = imgArr.link;
    }

    //select first tag in tags array for category
    if(item.tags.length > 0){
      let tagsArr = item.tags[0];
      tag = tagsArr.name;
    }
    else{
      tag='';
    }

    //select

    //community item structured response
    return {
      url: item.link,
      title: item.title,
      img, 
      publishedAt: item.datetime,
      category: tag,
      source: 'imgur'
    };
  });
}

function standardizeRedditData(results){
  return results.data.children.map(item => {
    //create link for url
    let url;
    url = 'https://www.reddit.com/'+item.data.permalink;

    //community item structured response
    return {
      url,
      title: item.data.title,
      img: item.data.url, 
      publishedAt: item.data.created_utc,
      category: item.data.subreddit_name_prefixed,
      source: 'reddit'
    };
  });
}

//main function
function standardizeCommunity(data){

}

module.exports = { standardizeImgurData, standardizeRedditData };