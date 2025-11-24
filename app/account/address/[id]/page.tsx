import AddressForm from "@/components/custom/AddressForm";

async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    return <AddressForm id={id} />;
}

export default Page;
