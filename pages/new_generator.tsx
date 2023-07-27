import Link from "next/link";
import React, { useState } from "react";
import { submitCreateGeneratorForm } from "../domain/usecases/create_generator";

const NewGenerator = () => {
  const [name, setName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [genres, setGenres] = useState("");
  const [socialFollowing, setSocialFollowing] = useState("");
  const [postFreq, setPostFreq] = useState("");
  const [sellingPoint, setSellingPoint] = useState("");
  const [theme, setTheme] = useState("");
  const [planLength, setPlanLength] = useState("");
  const [referenceImages, setReferenceImages] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length < 3 || e.target.files.length > 5) {
      alert("Please select 3 to 5 images");
      return;
    }
    setSelectedFiles(Array.from(e.target.files));
  };

  const onNewGeneratorClick = async () => {
    await submitCreateGeneratorForm({
      name: name,
      artistName: artistName,
      genres: genres,
      socialFollowing: socialFollowing,
      postFreq: postFreq,
      sellingPoint: sellingPoint,
      theme: theme,
      planLength: planLength,
      referenceImages: referenceImages,
    });
  };

  return (
    <div className="grid h-full grid-cols-1 gap-2 rounded-lg bg-[#FFF] p-8 shadow-lg">
      <div>
        <div className="pb-8">
          <p className="max-h-10 text-4xl font-bold text-[#42A5F5]">
            NEW MODEL
          </p>
        </div>

        <form className="w-full max-w-sm" onSubmit={onNewGeneratorClick}>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
                htmlFor="inline-artistName"
              >
                What do you want to call this model?
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="inline-artistName"
                type="text"
                placeholder=""
                onChange={(e: any) => setName(e.target.value)}
                value={name}
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
                htmlFor="inline-artistName"
              >
                What is your artist name?
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="inline-artistName"
                type="text"
                placeholder=""
                onChange={(e: any) => setArtistName(e.target.value)}
                value={artistName}
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
                htmlFor="inline-artistName"
              >
                What 3 genres would you use to describe your music?
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="inline-genres"
                type="text"
                placeholder=""
                onChange={(e: any) => setGenres(e.target.value)}
                value={genres}
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
                htmlFor="inline-socialFollowing"
              >
                How big is your following on all social media platforms
                combined?
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="inline-socialFollowing"
                type="text"
                placeholder=""
                onChange={(e: any) => setSocialFollowing(e.target.value)}
                value={socialFollowing}
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
                htmlFor="inline-sellingPoint"
              >
                What is your main selling point as a creative?
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="inline-sellingPoint"
                type="text"
                placeholder=""
                onChange={(e: any) => setSellingPoint(e.target.value)}
                value={sellingPoint}
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
                htmlFor="inline-theme"
              >
                What should the theme for your image content be?
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="inline-theme"
                type="text"
                placeholder=""
                onChange={(e: any) => setTheme(e.target.value)}
                value={theme}
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
                htmlFor="inline-planLength"
              >
                How long do you want this plan to be in effect for?
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="inline-planLength"
                type="text"
                placeholder=""
                onChange={(e: any) => setPlanLength(e.target.value)}
                value={planLength}
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right"
                htmlFor="inline-postFreq"
              >
                How often do you want to post on socials?
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                id="inline-postFreq"
                type="text"
                placeholder=""
                onChange={(e: any) => setPostFreq(e.target.value)}
                value={postFreq}
                required
              ></input>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block pr-4 text-xs font-bold text-gray-500 md:mb-0 md:text-right">
                Model Image Source
              </label>
            </div>
            <div className="md:w-2/3">
              <input type="file" accept="image/*" multiple onChange={handleFileChange} />
              {/* <button className="tapped_btn" type="button">
                Upload Images
              </button> */}
            </div>
          </div>

          <div className="pt-10">
            <Link href="/creating_model">
              <button
                disabled={!name || !artistName || !genres || !socialFollowing || !postFreq || !sellingPoint || !theme || !planLength}
                className="tapped_btn max-h-10 w-full"
                type="submit"
                onClick={onNewGeneratorClick}
              >
                Create New Model
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGenerator;
