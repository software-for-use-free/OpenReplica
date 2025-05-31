"""
Base agent class and configuration
"""
from abc import ABC, abstractmethod
from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel


class AgentState(Enum):
    """Agent state enumeration"""
    IDLE = "idle"
    THINKING = "thinking"
    ACTING = "acting"
    WAITING = "waiting"
    FINISHED = "finished"
    ERROR = "error"


class AgentConfig(BaseModel):
    """Agent configuration"""
    workspace_dir: str
    max_iterations: int = 100
    timeout: int = 300
    model: str = "gpt-4"
    temperature: float = 0.1
    
    class Config:
        extra = "allow"


class Agent(ABC):
    """Base agent class"""
    
    def __init__(self, config: AgentConfig):
        self.config = config
        self.state = AgentState.IDLE
        self.session_id: Optional[str] = None
        self.iteration = 0
        self.stats = {
            "messages_sent": 0,
            "actions_taken": 0,
            "errors": 0,
            "start_time": None,
            "end_time": None,
        }
    
    def set_session_id(self, session_id: str):
        """Set the session ID for this agent"""
        self.session_id = session_id
    
    @abstractmethod
    async def step(self, message: str) -> Dict[str, Any]:
        """Execute one step of the agent"""
        pass
    
    async def reset(self):
        """Reset the agent to initial state"""
        self.state = AgentState.IDLE
        self.iteration = 0
        self.stats = {
            "messages_sent": 0,
            "actions_taken": 0,
            "errors": 0,
            "start_time": None,
            "end_time": None,
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """Get agent statistics"""
        return self.stats.copy()
