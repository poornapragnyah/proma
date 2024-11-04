import { useRouter } from "next/navigation";

const Card = (props) => {
  const router = useRouter();
  const handleClick = () => {
    if(!props.link){
      props.link = "/"
    }
    router.push(props.link);
  }
    return (
      <div className="card bg-white shadow-xl overflow-hidden m-4">
        <div className="card-body h-full">
          <h2 className="text-center flex justify-center items-center text-4xl text-[#3ccbe7] font-bold p-2 rounded-lg">{props.name}{props.svg}
</h2>
          <div>{props.description}</div>
          <div className="flex flex-col justify-end">
            <button className="btn bg-[#3ccbe7] text-[#ffffff] border-none hover:bg-[#5ddcf5dd]" onClick={handleClick}>{props.button}</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Card;
