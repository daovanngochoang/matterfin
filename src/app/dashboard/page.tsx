import StatisticCard from "@/components/StatisticCard";
import { getPaymentRequests } from "@/lib/actions/paymentRequestAction";
import { PaymentStatus } from "@/lib/model/enum";
import { PaymentRequest } from "@/lib/model/paymentRequest";
import { DashboardTable } from "./dashboard-table";




const sortBydDate = (a: PaymentRequest, b: PaymentRequest) => {
  let dateA = new Date(a.expired_date!)
  let dateB = new Date(b.expired_date!)
  return dateA.getTime() - dateB.getTime();
}



const Dashboard = async () => {
  try {
    const paymenRequests = await getPaymentRequests()
    if (paymenRequests.error === undefined) {

      const paidPr: PaymentRequest[] = []
      const overDue: PaymentRequest[] = []
      const allPrs: PaymentRequest[] = paymenRequests.data!
      let totalAmount = 0;
      let overDueAmount = 0;
      let paidAmount = 0;

      allPrs.forEach(element => {
        if (element.status === PaymentStatus.PAID) {
          paidPr.push(element)
          paidAmount += element.amount!
        } else if (element.status === PaymentStatus.OVERDUE) {
          overDue.push(element)
          overDueAmount += element.amount!
        }
        totalAmount = totalAmount + element.amount!
      });

      paidPr.sort(sortBydDate)

      return (
        <>
          <div className="w-full space-y-10">
            <StatisticCard total={totalAmount} currency={'USD'} overdue={overDueAmount} paid={paidAmount} />
            <DashboardTable paymentRequests={paymenRequests.data!} paymentMethods={[]}/>
          </div>
        </>
      );

    } else {
      return (
        <div>{paymenRequests.error}</div>
      )
    }

  } catch (e) {
    return <div>{(e as Error).message}</div>
  }

}


export default Dashboard;
