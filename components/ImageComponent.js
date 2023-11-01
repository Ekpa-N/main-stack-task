import Image from "next/image"

export default function ImageHolder({src, alt="image", sizing={width:0, height:0}, filling=false}) {
    return (
        <>
        <Image
        src={src}
        alt={alt}
        fill={filling}
        width={sizing.width}
        height={sizing.height}
        priority
        // sizes="(min-width: 740px) 674px, calc(95.48vw-18px)"
        >            
        </Image>
        </>
    )
}