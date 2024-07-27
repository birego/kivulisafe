import { Carousel, Typography, Button } from "@material-tailwind/react";
import KivuImg from "../assets/1024px-2015_Goma_-_North_Kivu_(20441424453).jpg";
import GomaImg from "../assets/Amani_festival_-_Goma_2016_(24925981282).jpg"
import Dgo from "../assets/Fishing_in_Kivu_lake_of_small_fishes.jpg"
export function CarouselWithContent() {
  return (
    <Carousel className="rounded-xl">
      <div className="relative h-full w-full">
        <img
          src={KivuImg}
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
          <div className="w-3/4 text-center md:w-2/4">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Signalez les abus
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Aidez à rendre votre communauté plus sûre en signalant les abus
              anonymement sur KivuSafe. Chaque signalement peut sauver des vies
              et apporter la paix dans les zones les plus touchées.
            </Typography>
            <div className="flex justify-center gap-2">
              <Button size="lg" color="white">
               <a href="#sign"> <a href="#sign"> Signaler</a></a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full">
        <img
          src={GomaImg}
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-center bg-black/75">
          <div className="w-3/4 pl-12 md:w-2/4 md:pl-20 lg:pl-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Votre voix compte
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Partagez ce que vous avez vu ou vécu. Chaque signalement peut
              faire une différence en fournissant des informations cruciales aux
              ONG et aux autorités pour mieux protéger les populations
              vulnérables.
            </Typography>
            <div className="flex gap-2">
              <Button size="lg" color="white">
              <a href="#sign"> Signaler</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full">
        <img
          src={Dgo}
          alt="image 3"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-end bg-black/75">
          <div className="w-3/4 pl-12 pb-12 md:w-2/4 md:pl-20 md:pb-20 lg:pl-32 lg:pb-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              Protégez les innocents
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Utilisez KivuSafe pour rapporter les abus en toute sécurité et
              confidentialité. Votre action peut aider à mettre fin à la
              violence et garantir un avenir plus sûr pour tous.
            </Typography>
            <div className="flex gap-2">
              <Button size="lg" color="white">
                <a href="#sign"> Signaler</a>
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
}
