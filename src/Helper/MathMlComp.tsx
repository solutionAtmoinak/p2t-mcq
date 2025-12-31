import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useEffect, useState } from "react";

function MathMLComp({ data }: { data: string }) {
  const [parts, setParts] = useState<string[]>([]);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    // Split the data into parts and trigger rendering with a delay.
    const splitData = [data];
    setParts(splitData);

    // Set a delay to ensure that MathJax typesets after React renders
    const timeout = setTimeout(() => {
      setIsRendering(true);
    }, 100); // Adjust delay if needed (e.g., 50ms or 100ms)

    return () => {
      clearTimeout(timeout); // Cleanup timeout if the component is unmounted
      setIsRendering(false); // Reset rendering flag
    };
  }, [data]); // Only run this effect when `data` changes

  return (
    <MathJaxContext>
      {isRendering ? (
        parts.map((part, index) => (
          <MathJax inline key={index}>
            <span
              dangerouslySetInnerHTML={{
                __html: part,
              }}
            ></span>
          </MathJax>
        ))
      ) : (
        <span>Loading...</span> // Show loading message while MathJax is rendering
      )}
    </MathJaxContext>
  );
}

export default MathMLComp;

// NEW code

// const cleanData = data.replace(/<\?xml.*?\?>/, "");
// if (cleanData.includes("<math")) {
//   return (
//     <MathJaxContext>
//       <MathJax dynamic={true}>
//         <span dangerouslySetInnerHTML={{ __html: cleanData }}></span>
//       </MathJax>
//     </MathJaxContext>
//   );
// } else {
//   return <span>{data}</span>;
// }
