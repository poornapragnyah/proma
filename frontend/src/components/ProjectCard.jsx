import Image from "next/image";
import { useRouter } from "next/navigation";

const ProjectCard = (props) => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/projects/"+props.link);
    }

    return (
      <div className="card bg-white shadow-xl m-4">
        <div className="card-body h-full">
          <h2 className="text-center flex justify-center items-center text-4xl text-[#3ccbe7] font-bold p-2 rounded-lg">{props.name}{props.svg}
</h2>
          <div>{props.description}</div>
          <div className="flex flex-col justify-end">
            <button className="btn bg-[#3ccbe7] text-[#ffffff] border-none hover:bg-[#5ddcf5dd]" onClick={handleClick}>View Project</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectCard;
