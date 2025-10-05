function PacketGeneration() {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 p-6">
                <div className="card bg-base-200 shadow-xl h-full">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">数据包生成</h2>
                        <p className="text-base-content/70">
                            RoboMaster Packet Library - 自定义数据包生成工具
                        </p>
                        <div className="divider"></div>
                        <div className="space-y-4">
                            <div className="alert alert-info">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>数据包生成功能开发中...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PacketGeneration;