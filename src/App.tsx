import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Download, Sparkles, Settings, Eye } from "lucide-react"
import { toast } from "sonner"
import { Input } from "./components/ui/input"

export default function TextToSVGApp() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSVG, setGeneratedSVG] = useState("")
  const [showSettings, setShowSettings] = useState(false)

  const generateSVG = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast("프롬프트를 입력해주세요", {
        description: "SVG를 생성하기 위한 설명을 입력해주세요.",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch(import.meta.env.VITE_PUBLIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      })
      console.log("Response:", response)

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`)
      }

      const result = await response.json()

      setGeneratedSVG(result.svg)

    } catch (error) {
      console.error("Error generating SVG:", error)
      toast("생성 실패",{
        description: "SVG 생성 중 오류가 발생했습니다. API 키와 프롬프트를 확인해주세요.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadSVG = () => {
    if (!generatedSVG) return 

    const blob = new Blob([generatedSVG], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `text-to-svg-${Date.now()}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast("다운로드 완료",{
      description: "SVG 파일이 다운로드되었습니다.",
    })
  }

  const examplePrompts = [
    "wifi icon",
    "wifi-off icon",
    "cat icon",
    "clock icon",
    "arrow icon",
    "arrow-left icon",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 w-full">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Text To SVG Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI를 활용하여 텍스트 설명으로부터 아웃라인 SVG 벡터 이미지를 생성하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  프롬프트 입력
                </CardTitle>
                <CardDescription>생성하고 싶은 SVG에 대한 간단한 단어로 적어주세요.</CardDescription>
              </CardHeader>
              <CardContent >
                <form onSubmit={generateSVG} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-sm font-medium">
                      설명
                    </Label>
                    <Input
                      id="prompt"
                      placeholder="예: 미니멀한 스타일의 산과 달이 있는 풍경, 파스텔 색상, 벡터 일러스트"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="resize-none border-gray-200 focus:border-purple-400"
                    />
                  </div>
  
                  <div className="flex gap-2">
                    <Button
                      disabled={isGenerating || !prompt.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          SVG 생성하기
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => setShowSettings(!showSettings)} className="px-3">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-sm text-blue-800">💡 생성 팁</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-700 space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>현재 데이터셋 부족으로 인하여 영어 단어로 된 프롬프트만 가능합니다.</strong>
                  </li>
                  <li>
                    <strong>프롬프트 예시 :</strong> "wifi", "wifi-off", "cat", "clock", "arrow", "arrow-left"
                  </li>
                  <li>
                    <strong>결과 :</strong> 검은색 단일 선으로 된 아웃라인 SVG 벡터 이미지만 생성됩니다.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  미리보기
                </CardTitle>
                <CardDescription>생성된 SVG가 여기에 표시됩니다</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedSVG ? (
                  <div className="space-y-4">
                    <div className="w-full h-80 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-white overflow-hidden p-4">
                      <div className="max-w-full max-h-full w-50 h-50" dangerouslySetInnerHTML={{ __html: generatedSVG }} />
                    </div>
                    <Button onClick={downloadSVG} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      SVG 다운로드
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-80 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 bg-gray-50">
                    {isGenerating ? (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
                        <p className="text-lg font-medium text-gray-600">SVG 생성 중...</p>
                        <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>생성된 SVG가 여기에 표시됩니다</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Examples Section */}
        <Card className="mt-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>예시 프롬프트</CardTitle>
            <CardDescription>아래 예시들을 클릭하여 바로 사용해보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  className="text-left justify-start h-auto p-4 text-sm border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  onClick={() => setPrompt(example)}
                >
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0 mt-1"></div>
                  <span className="text-wrap">{example}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>handmade text2svg 모델 사용</p>
        </div>
      </div>
    </div>
  )
}
