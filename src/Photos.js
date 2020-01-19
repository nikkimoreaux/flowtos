import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Gallery from "react-photo-gallery";
import FsLightbox from "fslightbox-react";
import Photo from "./Photo";

import "./Photos.scss";

function Photos(props) {
  const { photoList, photoLibraryEndpoint } = props;

  let history = useHistory();
  let { photoId, albumId } = useParams();

  // remapping of the photo list
  let photoThumbnails = photoList.map(photo => {
    return {
      src: photoLibraryEndpoint + photo.thumbnailUrl,
      srcSet: [
        photoLibraryEndpoint + photo.thumbnailUrl + " 1x",
        photoLibraryEndpoint + photo.thumbnail2xUrl + " 2x"
      ],
      width: photo.width,
      height: photo.height,
      key: photo.id.toString()
    };
  });
  let photos = photoList.map(photo => photoLibraryEndpoint + photo.photoUrl);

  let [lightboxController, setLightboxController] = useState({
    toggler: false,
    sourceIndex: photoThumbnails.findIndex(
      photoThumbnail => photoThumbnail.key === photoId
    )
  });

  let openLightboxOnSlide = (event, { photo, index }) => {
    if (albumId) {
      history.push("/albums/" + albumId + "/" + photo.key);
    } else {
      history.push("/photos/" + photo.key);
    }
    setLightboxController({
      toggler: !lightboxController.toggler,
      sourceIndex: index
    });
  };

  let onLightBoxCloseHandler = () => {
    if (albumId) {
      history.push("/albums/" + albumId);
    } else {
      history.push("/");
    }
  };

  let imageRenderer = ({ margin, index, left, top, key, photo, onClick }) => (
    <Photo
      key={key}
      margin={margin}
      index={index}
      photo={photo}
      left={left}
      top={top}
      onClick={onClick}
    />
  );

  return (
    <div className="mb-4 photos">
      <Gallery
        photos={photoThumbnails}
        onClick={openLightboxOnSlide}
        margin={4}
        renderImage={imageRenderer}
      />
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={photos}
        type="image"
        sourceIndex={lightboxController.sourceIndex}
        openOnMount={photoId ? true : false}
        onClose={onLightBoxCloseHandler}
      />
    </div>
  );
}

export default Photos;
