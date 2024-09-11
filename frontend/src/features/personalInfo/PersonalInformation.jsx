import { useEffect, useState } from "react";
import { 
    useGetPersonalInformationQuery, 
    useUpdatePersonalInformationMutation 
} from "./personalInfoApiSlice";
import useAuth from "../../hooks/useAuth";
import LoadingPage from "../../pages/loadingPage";
import { toast } from 'sonner';

const PersonalInformation = () => {
    const { id } = useAuth();
    const [personalInformation, setPersonalInformation] = useState({
        fullName: "",
        email: "",
        address: {
            streetAddress: "",
            city: "",
            state: "",
            country: "",
            pincode: ""
        },
        pan: "",
        aadhaar: "",
        passport: "",
        phone: "",
        password: ""
    });

    // State to track the original information
    const [originalInformation, setOriginalInformation] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [updatePersonalInformation] = useUpdatePersonalInformationMutation();

    const {
        data: user,
        isLoading,
        isSuccess,
        isError,
    } = useGetPersonalInformationQuery(
        id, 
        { skip: !id }, 
        {
            pollingInterval: 60000,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true
        });

    useEffect(() => {
        if (user) {
            const newInfo = {
                fullName: user.fullName || "", 
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || {
                    streetAddress: "",
                    city: "",
                    state: "",
                    country: "",
                    pincode: ""
                },
                pan: user.pan || "",
                aadhaar: user.aadhaar || "",
                passport: user.passport || ""
            };
            setPersonalInformation(newInfo);
            setOriginalInformation(newInfo);
        }
    }, [user, id]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (hasChanges) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasChanges]);

    useEffect(() => {
        if (originalInformation) {
            setHasChanges(JSON.stringify(personalInformation) !== JSON.stringify(originalInformation));
        }
    }, [personalInformation, originalInformation]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setPersonalInformation(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setPersonalInformation(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSavePersonalInformation = () => {
        if (id) {
            updatePersonalInformation({
                id: id,
                fullName: personalInformation.fullName, 
                email: personalInformation.email,
                phone: personalInformation.phone,
                address: personalInformation.address,
                pan: personalInformation.pan,
                aadhaar: personalInformation.aadhaar,
                passport: personalInformation.passport
            }).unwrap()
            .then(() => {
                toast.success("Personal information updated successfully", { position: 'bottom-left' });
                setHasChanges(false); 
                setOriginalInformation(personalInformation);
            })
            .catch((error) => {
                toast.error(error?.data?.message || 'Failed to update personal information', { position: 'bottom-left' });
            });
        } 
    };

    let content;
    if (isLoading) {
        content = <LoadingPage />;
    } else if (isSuccess) {
        content = (
            <form>
                <div className="px-4 w-full md:w-1/2">
                    <label htmlFor="fullName" className="text-xs">Name</label>
                    <div>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={personalInformation.fullName}
                            onChange={handleInputChange}
                            className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"

                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-evenly mt-2">
                    <div className="flex-col w-full px-4">
                        <label htmlFor="email" className="text-xs">Email</label>
                        <div className="w-full">
                            <input
                                type="text"
                                id="email"
                                name="email"
                                disabled
                                value={personalInformation.email}
                                onChange={handleInputChange}
                                className="mt-1.5 w-full bg-neutral-700 block rounded-md border-0 py-1.5 text-neutral-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="flex-col w-full px-4">
                        <label htmlFor="phone" className="text-xs">Phone</label>
                        <div className="w-full">
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={personalInformation.phone}
                                onChange={handleInputChange}
                                className="mt-1.5 w-full bg-neutral-700 block rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="px-4 w-full md:w-1/2 mt-2">
                        <label htmlFor="country" className="text-xs">Country</label>
                        <div>
                            <input
                                type="text"
                                id="country"
                                name="address.country"
                                value={personalInformation.address.country}
                                onChange={handleInputChange}
                                className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="px-4 mt-2">
                        <label htmlFor="streetAddress" className="text-xs">Street Address</label>
                        <div>
                            <input
                                type="text"
                                id="streetAddress"
                                name="address.streetAddress"
                                value={personalInformation.address.streetAddress}
                                onChange={handleInputChange}
                                className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-evenly mt-2">
                        <div className="w-full px-4">
                            <label htmlFor="city" className="text-xs">City</label>
                            <div>
                                <input
                                    type="text"
                                    id="city"
                                    name="address.city"
                                    value={personalInformation.address.city}
                                    onChange={handleInputChange}
                                    className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="w-full px-4 md:px-2">
                            <label htmlFor="state" className="text-xs">State</label>
                            <div>
                                <input
                                    type="text"
                                    id="state"
                                    name="address.state"
                                    value={personalInformation.address.state}
                                    onChange={handleInputChange}
                                    className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="w-full px-4">
                            <label htmlFor="pincode" className="text-xs">PIN Code</label>
                            <div>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="address.pincode"
                                    value={personalInformation.address.pincode}
                                    onChange={handleInputChange}
                                    className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-evenly mt-2">
                        <div className="w-full px-4">
                            <label htmlFor="pan" className="text-xs">PAN</label>
                            <div>
                                <input
                                    type="text"
                                    id="pan"
                                    name="pan"
                                    value={personalInformation.pan}
                                    onChange={handleInputChange}
                                    className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="w-full px-4 md:px-2">
                            <label htmlFor="aadhaar" className="text-xs">Aadhaar Number</label>
                            <div>
                                <input
                                    type="text"
                                    id="aadhaar"
                                    name="aadhaar"
                                    value={personalInformation.aadhaar}
                                    onChange={handleInputChange}
                                    className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="w-full px-4">
                            <label htmlFor="passport" className="text-xs">Passport Number</label>
                            <div>
                                <input
                                    type="text"
                                    id="passport"
                                    name="passport"
                                    value={personalInformation.passport}
                                    onChange={handleInputChange}
                                    className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>    
        );

    } else if (isError) {
        content = <p className="text-gray-300 text-sm">Failed to load user information</p>;
    }

    return (
        <main>
            <div className="bg-primary flex flex-col w-screen md:w-[700px] mx-auto text-white">
                <div className="bg-primary w-screen md:w-[700px] px-6 lg:px-0 flex py-2 justify-between">
                    <h1 className="text-white text-xl">Personal Information</h1>
                    <div className="flex">
                        <button 
                            type="button"
                            disabled={!hasChanges}
                            onClick={handleSavePersonalInformation}
                            className="text-white font-medium text-sm border-2 border-purple-800 px-4 rounded-full"
                        >
                            {hasChanges ? "Save" : "Saved"}
                        </button>
                    </div>
                </div>
                <div className="mt-2 pb-10 px-2 bg-secondary py-5 text-zinc-300 rounded-none md:rounded-lg">
                    {content}
                </div>
            </div>
        </main>
    );
};

export default PersonalInformation;
