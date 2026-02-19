import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useGetTheoryQuery } from "../../Api/spAppApi";
import convertData from "../../Helper/ConvertData";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import TheoryExamPractice from "../Theory/TheoryExamPractice";
import TheoryExamRegular from "../Theory/TheoryExamRegular";
import PackageLayout from "./Package";

const TestSeriesPage = () => {
  const [selectedPackage] = useState<any>(null);
  const [TheoryList, setTheoryList] = useState<any[]>([]);

  const TheoryData = useGetTheoryQuery({
    PackageId: selectedPackage?.PackageId || "",
  });

  useEffect(() => {
    if (TheoryData.isError) {
      rtkErrorRead(TheoryData.error);
    } else {
      const Theory = convertData(TheoryData?.data?.result);
      if (Theory && Theory.length > 0) {
        setTheoryList(Theory);
      }
    }
  }, [TheoryData]);

  // console.log({TheoryList});

  // const handlePackageSelect = (pkg: any) => {
  //   setSelectedPackage(pkg);
  // };

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-5 overflow-hidden max-h-screen">
      <div className="col-span-1">
        <div className="h-screen">
          <PackageLayout />
        </div>
      </div>
      <div className="col-span-4 p-6 overflow-y-auto">
        <Tab.Group>
          <Tab.List className="flex flex-wrap sticky top-0 z-10 bg-white  ">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${selected
                    ? "text-white  bg-blue-500 outline-none  border-blue-700"
                    : " text-slate-500"
                    }
                    -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2 font-bold`}
                >
                  Theory Practice
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={`${selected
                    ? "text-white  bg-blue-500 outline-none  border-blue-700"
                    : " text-slate-500"
                    } 
                    -mb-[1px] block rounded p-3.5 py-2 hover:bg-primary hover:text-white ltr:mr-2 rtl:ml-2 font-bold`}
                >
                  Theory Regular
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="active pt-5">
                <TheoryExamPractice TheoryList={TheoryList} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className=" pt-5">
                <TheoryExamRegular TheoryList={TheoryList} />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default TestSeriesPage;
