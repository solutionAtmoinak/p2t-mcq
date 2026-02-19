import { useEffect, useState } from "react";
import { useGetPackageQuery } from "../../Api/spAppApi";
import convertData from "../../Helper/ConvertData";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import { useLogoutUserMutation } from "../../Api/authApi";
import toastNotify from "../../Helper/ToastNotify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/Store";
import { setSelectedPackage } from "../../Store/Slice/DetailSlice";


const PackageLayout = () => {
  const dispatch = useDispatch()
  const { data, isError, error } = useGetPackageQuery({});
  const [logoutApi] = useLogoutUserMutation()
  const [packageList, setPackageList] = useState<any[]>([]);
  const { selectedPackage } = useSelector((s: RootState) => s.detailed)


  useEffect(() => {
    if (isError) {
      rtkErrorRead(error);
    } else {
      const PackageData = convertData(data?.result);
      // console.log(PackageData)
      if (PackageData && PackageData.length > 0) {
        setPackageList(PackageData);
        if (selectedPackage === null) {
          dispatch(setSelectedPackage(PackageData[0]))
        }
      }
    }
  }, [data, error, isError]);

  const handlePackageClick = (pkg: any) => {
    dispatch(setSelectedPackage(pkg))
  };

  async function handelLogout() {
    const res = await logoutApi(null)
    if (res.error) {
      rtkErrorRead(res.error)
    } else {
      toastNotify("Logout Successfully", "success")
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  }

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 border-r border-gray-200 shadow-lg">
      <div className="px-6 py-8 flex flex-col h-full">
        <h2 className="text-center text-2xl font-extrabold text-gray-800 mb-6 tracking-tight border-b pb-3">
          Package List
        </h2>
        <ul className="space-y-3">
          {packageList
            .filter(
              (value, index, self) =>
                self.findIndex((t) => t.PackageId === value.PackageId) === index
            )
            .map((pkg: any) => {
              const isSelected = selectedPackage?.PackageId === pkg.PackageId;

              return (
                <li
                  key={pkg.PackageId}
                  onClick={() => {
                    if (!isSelected) handlePackageClick(pkg);
                  }}
                  className={`text-center py-4 px-6 rounded-2xl cursor-pointer border backdrop-blur-sm transition-all duration-300
    text-base font-medium tracking-wide
    ${isSelected
                      ? "bg-[#043f72] text-white shadow-xl border-blue-700 text-xl"
                      : "bg-white/60 text-gray-900 hover:bg-blue-100 hover:border-blue-400 hover:shadow-md"
                    }`}
                >
                  {pkg.PackageName}
                </li>
              );
            })}
        </ul>
        <button onClick={handelLogout} type="button" className="mt-auto bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 transition duration-300 text-red-100">
          Log out
        </button>
      </div>
    </aside>
  );
};

export default PackageLayout;
