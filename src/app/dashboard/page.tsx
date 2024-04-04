import StatisticCard from "@/components/StatisticCard";


const Dashboard = () => {

    return (
        <>
            <div className="w-full">
                <StatisticCard total={800} currency={'USD'} overdue={100} paid={30}/>
            </div>
        </>
    );
}


export default Dashboard;
